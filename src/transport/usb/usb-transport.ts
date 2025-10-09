import { TransportInterface, PTPEvent } from '@transport/interfaces/transport.interface'
import { DeviceDescriptor } from '@transport/interfaces/device.interface'
import { TransportType } from '@transport/interfaces/transport-types'
import { Logger } from '@core/logger'
import { VendorIDs } from '@ptp/definitions/vendor-ids'
import { USBContainerBuilder, USBContainerType, toBuffer, toUint8Array } from './usb-container'

// WebUSB types are globally available from @types/w3c-web-usb
// No need to redefine: USBDevice, USBInterface, USBConfiguration, USBEndpoint,
// USBDirection, USBEndpointType, USBRequestType, USBRecipient, USBTransferStatus

// ============================================================================
// Type Definitions & Enums
// ============================================================================

/**
 * Endpoint types for our internal use
 */
export enum EndpointType {
    BULK_IN = 'bulk_in',
    BULK_OUT = 'bulk_out',
    INTERRUPT = 'interrupt',
}

/**
 * Endpoint configuration (uses standard USBEndpoint from WebUSB API)
 */
export interface EndpointConfiguration {
    bulkIn: USBEndpoint
    bulkOut: USBEndpoint
    interrupt?: USBEndpoint
}

/**
 * USB Class Request codes (PIMA 15740)
 */
enum USBClassRequest {
    CANCEL_REQUEST = 0x64,
    GET_EXTENDED_EVENT_DATA = 0x65,
    DEVICE_RESET = 0x66,
    GET_DEVICE_STATUS = 0x67,
}

/**
 * Device status response
 */
export interface DeviceStatus {
    code: number
    parameters: number[]
}

/**
 * Extended event data response
 */
export interface ExtendedEventData {
    eventCode: number
    transactionId: number
    parameters: Array<{ size: number; value: Uint8Array }>
}

// ============================================================================
// Constants
// ============================================================================

/**
 * USB Class Codes (from USB specification)
 */
const USB_CLASS_STILL_IMAGE = 6 // PTP/MTP devices (PIMA 15740)
const USB_SUBCLASS_STILL_IMAGE_CAPTURE = 1 // Still Image Capture Device

/**
 * USB-specific limits
 */
export const USB_LIMITS = {
    /** Maximum USB transfer size (1GB for large file transfers) */
    MAX_USB_TRANSFER: 1024 * 1024 * 1024,
    /** Default bulk transfer size */
    DEFAULT_BULK_SIZE: 8192,
} as const

// ============================================================================
// USB Transport (Main Class)
// ============================================================================

/**
 * USB transport implementation for PTP communication
 */
export class USBTransport implements TransportInterface {
    private device: USBDevice | null = null
    private interfaceNumber: number = 0
    private endpoints: EndpointConfiguration | null = null
    private connected = false
    private deviceInfo: { vendorId: number; productId: number } | null = null
    private eventHandlers: Set<(event: PTPEvent) => void> = new Set()
    private usb: USB | null = null
    private isListeningForEvents = false
    private logger: Logger<any>

    constructor(logger: Logger<any>) {
        this.logger = logger
    }

    /**
     * Get WebUSB API instance (cached)
     * Works in both browser and Node.js environments
     */
    private async getUSB(): Promise<USB> {
        if (this.usb) {
            return this.usb
        }

        // Browser environment
        if (typeof navigator !== 'undefined' && 'usb' in navigator) {
            this.usb = navigator.usb
            return this.usb
        }

        // Node.js environment - use node-usb's WebUSB implementation
        const usb = await import('usb')
        this.usb = usb.webusb
        return this.usb
    }

    /**
     * Discover available USB devices
     * @param criteria - Optional criteria to filter devices (vendorId, productId, serialNumber)
     */
    async discover(criteria?: Partial<DeviceDescriptor>): Promise<DeviceDescriptor[]> {
        const usb = await this.getUSB()
        const devices = await usb.getDevices()

        return devices
            .filter(device => {
                if (device.vendorId === 0) return false
                if (criteria?.vendorId && criteria.vendorId !== 0 && device.vendorId !== criteria.vendorId) return false
                if (criteria?.productId && criteria.productId !== 0 && device.productId !== criteria.productId) return false
                if (criteria?.serialNumber && device.serialNumber !== criteria.serialNumber) return false
                return true
            })
            .map(device => ({
                device,
                vendorId: device.vendorId,
                productId: device.productId,
                manufacturer: device.manufacturerName || undefined,
                model: device.productName || undefined,
                serialNumber: device.serialNumber || undefined,
            }))
    }

    /**
     * Connect to a USB device
     */
    async connect(deviceIdentifier?: DeviceDescriptor): Promise<void> {
        if (this.connected) {
            throw new Error('Already connected')
        }

        this.isListeningForEvents = false
        const usb = await this.getUSB()

        // Try to find in authorized devices first (if specific device requested)
        let usbDevice: USBDevice | undefined
        if (deviceIdentifier?.vendorId && deviceIdentifier.vendorId !== 0) {
            const devices = await this.discover(deviceIdentifier)
            usbDevice = devices[0]?.device as USBDevice
        }

        // If not found, request from user
        if (!usbDevice) {
            const filters = deviceIdentifier?.vendorId && deviceIdentifier.vendorId !== 0
                ? [{
                    vendorId: deviceIdentifier.vendorId,
                    ...(deviceIdentifier.productId && deviceIdentifier.productId !== 0 && { productId: deviceIdentifier.productId })
                }]
                : Object.values(VendorIDs).map(vendorId => ({ vendorId }))

            usbDevice = await usb.requestDevice({ filters })
        }

        // Open device and configure
        this.device = usbDevice
        this.deviceInfo = { vendorId: usbDevice.vendorId, productId: usbDevice.productId }
        await this.device.open()

        // Find and claim PTP interface
        const config = this.device.configuration || this.device.configurations?.[0]
        if (!config) throw new Error('No USB configuration available')

        const ptpInterface = config.interfaces.find(intf => {
            const alt = intf.alternates?.[0] || intf.alternate
            return alt?.interfaceClass === USB_CLASS_STILL_IMAGE && alt?.interfaceSubclass === USB_SUBCLASS_STILL_IMAGE_CAPTURE
        })
        if (!ptpInterface) throw new Error('PTP interface not found')

        this.interfaceNumber = ptpInterface.interfaceNumber
        await this.device.claimInterface(this.interfaceNumber)

        // Find endpoints
        const alt = ptpInterface.alternates?.[0] || ptpInterface.alternate
        if (!alt) throw new Error('No alternate interface found')

        const bulkIn = alt.endpoints.find(ep => ep.direction === 'in' && ep.type === 'bulk')
        const bulkOut = alt.endpoints.find(ep => ep.direction === 'out' && ep.type === 'bulk')
        const interrupt = alt.endpoints.find(ep => ep.direction === 'in' && ep.type === 'interrupt')

        if (!bulkIn || !bulkOut) throw new Error('Required bulk endpoints not found')

        this.endpoints = { bulkIn, bulkOut, interrupt }
        this.connected = true

        if (interrupt) this.startListeningForEvents()
    }

    /**
     * Disconnect from the current device
     */
    async disconnect(): Promise<void> {
        console.log('[DEBUG] USBTransport.disconnect: Starting disconnect')
        if (!this.connected) {
            return
        }

        console.log('[DEBUG] Stopping event listening')
        this.isListeningForEvents = false

        // Force any pending interrupt transfer to complete
        if (this.endpoints?.interrupt && this.device) {
            try {
                await this.device.clearHalt('in', this.endpoints.interrupt.endpointNumber)
            } catch (error) {
                // Expected - transfer may be cancelled
            }
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        if (this.device) {
            console.log('[DEBUG] Closing device')
            await this.device.close()
        }

        this.device = null
        this.interfaceNumber = 0
        this.endpoints = null
        this.connected = false
        this.eventHandlers.clear()
        console.log('[DEBUG] Disconnect complete')
    }

    /**
     * Send data over USB bulk OUT endpoint
     */
    async send(data: Uint8Array, sessionId: number, transactionId: number): Promise<void> {
        if (!this.connected || !this.endpoints || !this.device) {
            throw new Error('Not connected')
        }

        const buffer = toBuffer(data)
        const endpointAddress = this.endpoints.bulkOut.endpointNumber
        const container = USBContainerBuilder.parseContainer(data)

        console.log(
            `[DEBUG] bulkOut: endpoint=0x${endpointAddress.toString(16)}, bytes=${buffer.length}, sessionId=${sessionId}, transactionId=${transactionId}`
        )

        this.logger.addLog({
            type: 'usb_transfer',
            level: 'info',
            direction: 'send',
            bytes: buffer.length,
            endpoint: 'bulkOut',
            endpointAddress: `0x${endpointAddress.toString(16)}`,
            sessionId: sessionId,
            transactionId: transactionId,
            phase:
                container.type === USBContainerType.COMMAND
                    ? 'request'
                    : container.type === USBContainerType.DATA
                      ? 'data'
                      : 'response',
        })

        let result = await this.device.transferOut(endpointAddress, buffer.buffer as ArrayBuffer)

        console.log(`[DEBUG] bulkOut: status=${result.status}`)

        // Handle STALL per PIMA 15740 Figure 4
        if (result.status === 'stall') {
            console.log('[STALL] bulkOut: Endpoint stalled, following PTP recovery procedure')
            await this.handleStallError(EndpointType.BULK_OUT)
            result = await this.device.transferOut(endpointAddress, buffer.buffer as ArrayBuffer)
            console.log(`[STALL] bulkOut: Retry status=${result.status}`)
        }

        if (result.status !== 'ok') {
            throw new Error(`Bulk OUT failed: ${result.status}`)
        }
    }

    /**
     * Receive data over USB bulk IN endpoint
     */
    async receive(maxLength: number, sessionId: number, transactionId: number): Promise<Uint8Array> {
        if (!this.connected || !this.endpoints || !this.device) {
            throw new Error('Not connected')
        }

        const endpointAddr = this.endpoints.bulkIn.endpointNumber

        console.log(
            `[DEBUG] bulkIn: endpoint=0x${endpointAddr.toString(16)}, maxLength=${maxLength}, sessionId=${sessionId}, transactionId=${transactionId}`
        )

        // Transfer with 5 second timeout
        const transfer = this.device.transferIn(endpointAddr, maxLength)
        const timeout = new Promise<USBInTransferResult>((_, reject) => {
            setTimeout(
                () => reject(new Error(`BulkIn timeout after 5s (endpoint 0x${endpointAddr.toString(16)})`)),
                5000
            )
        })

        let result = await Promise.race([transfer, timeout])

        console.log(`[DEBUG] bulkIn: status=${result.status}`)

        // Handle STALL per PIMA 15740 Figure 4
        if (result.status === 'stall') {
            console.log('[STALL] bulkIn: Endpoint stalled, following PTP recovery procedure')
            await this.handleStallError(EndpointType.BULK_IN)
            result = await this.device.transferIn(endpointAddr, maxLength)
            console.log(`[STALL] bulkIn: Retry status=${result.status}`)
        }

        if (result.status !== 'ok' || !result.data || result.data.byteLength === 0) {
            throw new Error(`Bulk IN failed: ${result.status}`)
        }

        const data = toUint8Array(result.data.buffer as ArrayBuffer)
        const container = USBContainerBuilder.parseContainer(data)

        this.logger.addLog({
            type: 'usb_transfer',
            level: 'info',
            direction: 'receive',
            bytes: data.length,
            endpoint: 'bulkIn',
            endpointAddress: `0x${endpointAddr.toString(16)}`,
            sessionId: sessionId,
            transactionId: transactionId,
            phase:
                container.type === USBContainerType.COMMAND
                    ? 'request'
                    : container.type === USBContainerType.DATA
                      ? 'data'
                      : 'response',
        })

        return data
    }

    /**
     * Handle STALL per PIMA 15740 section D.7.2.1
     * 1. Get device status to determine which endpoints are stalled
     * 2. Clear halt on stalled endpoints
     * 3. Poll device status until OK (0x2001)
     */
    private async handleStallError(endpointType: EndpointType): Promise<void> {
        if (!this.device || !this.endpoints) {
            throw new Error('Cannot handle STALL without device and endpoints')
        }

        console.log(`[STALL] Handling ${endpointType} stall`)

        // Step 1: Get device status
        const initialStatus = await this.usbGetDeviceStatus()
        console.log(`[STALL] Device status: code=0x${initialStatus.code.toString(16)}`)

        // Step 2: Clear halt on affected endpoints
        if (endpointType === EndpointType.BULK_IN || endpointType === EndpointType.BULK_OUT) {
            // Clear both bulk endpoints (device may stall both per spec)
            await this.device.clearHalt('in', this.endpoints.bulkIn.endpointNumber)
            await this.device.clearHalt('out', this.endpoints.bulkOut.endpointNumber)
        } else if (endpointType === EndpointType.INTERRUPT && this.endpoints.interrupt) {
            await this.device.clearHalt('in', this.endpoints.interrupt.endpointNumber)
        }

        // Step 3: Poll status until device returns OK (0x2001)
        for (let i = 0; i < 10; i++) {
            const status = await this.usbGetDeviceStatus()
            if (status.code === 0x2001) {
                return
            }
            await new Promise(resolve => setTimeout(resolve, 50))
        }

        throw new Error('Device did not return OK after STALL recovery')
    }

    /**
     * Get device status (USB class request)
     */
    private async usbGetDeviceStatus(): Promise<DeviceStatus> {
        if (!this.device) {
            throw new Error('Device not connected')
        }

        const result = await this.device.controlTransferIn(
            {
                requestType: 'class',
                recipient: 'interface',
                request: USBClassRequest.GET_DEVICE_STATUS,
                value: 0,
                index: this.interfaceNumber,
            },
            20
        )

        if (!result || result.status !== 'ok' || !result.data || result.data.byteLength === 0) {
            throw new Error('Failed to get device status')
        }

        const data = new Uint8Array(result.data.buffer)
        const view = new DataView(data.buffer)

        const length = view.getUint16(0, true)
        const code = view.getUint16(2, true)

        const parameters: number[] = []
        let offset = 4
        while (offset + 4 <= length && offset < data.length) {
            parameters.push(view.getUint32(offset, true))
            offset += 4
        }

        return { code, parameters }
    }

    isConnected(): boolean {
        return this.connected
    }

    /**
     * Reset the USB device (USB class request)
     */
    async reset(): Promise<void> {
        if (!this.connected || !this.device) {
            throw new Error('Not connected')
        }

        await this.device.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: USBClassRequest.DEVICE_RESET,
            value: 0,
            index: this.interfaceNumber,
        })
    }

    /**
     * Cancel a PTP request (USB class request)
     */
    async cancelRequest(transactionId: number): Promise<void> {
        if (!this.connected || !this.device) {
            throw new Error('Not connected')
        }

        const data = new Uint8Array(6)
        const view = new DataView(data.buffer)
        view.setUint16(0, 0x4001, true)
        view.setUint32(2, transactionId, true)

        await this.device.controlTransferOut(
            {
                requestType: 'class',
                recipient: 'interface',
                request: USBClassRequest.CANCEL_REQUEST,
                value: 0,
                index: this.interfaceNumber,
            },
            data
        )
    }

    /**
     * Get device status
     */
    async getDeviceStatus(): Promise<DeviceStatus> {
        if (!this.connected) {
            throw new Error('Not connected')
        }
        return await this.usbGetDeviceStatus()
    }

    /**
     * Get extended event data (USB class request)
     */
    async getExtendedEventData(bufferSize: number = 512): Promise<ExtendedEventData> {
        if (!this.connected || !this.device) {
            throw new Error('Not connected')
        }

        const result = await this.device.controlTransferIn(
            {
                requestType: 'class',
                recipient: 'interface',
                request: USBClassRequest.GET_EXTENDED_EVENT_DATA,
                value: 0,
                index: this.interfaceNumber,
            },
            bufferSize
        )

        if (!result || result.status !== 'ok' || !result.data) {
            throw new Error('Failed to get extended event data')
        }

        const data = new Uint8Array(result.data.buffer)
        const view = new DataView(data.buffer)

        const eventCode = view.getUint16(0, true)
        const transactionId = view.getUint32(2, true)
        const numParameters = view.getUint16(6, true)

        const parameters: Array<{ size: number; value: Uint8Array }> = []
        let offset = 8

        for (let i = 0; i < numParameters && offset + 2 <= data.length; i++) {
            const paramSize = view.getUint16(offset, true)
            offset += 2

            if (offset + paramSize <= data.length) {
                const paramValue = data.slice(offset, offset + paramSize)
                parameters.push({ size: paramSize, value: paramValue })
                offset += paramSize
            }
        }

        return { eventCode, transactionId, parameters }
    }

    getType(): TransportType {
        return TransportType.USB
    }

    isLittleEndian(): boolean {
        return true
    }

    getDeviceInfo(): DeviceDescriptor | null {
        return this.deviceInfo
    }

    on(handler: (event: PTPEvent) => void): void {
        this.eventHandlers.add(handler)
    }

    off(handler: (event: PTPEvent) => void): void {
        this.eventHandlers.delete(handler)
    }

    /**
     * Stop listening for interrupt events
     */
    async stopEventListening(): Promise<void> {
        this.isListeningForEvents = false

        if (this.endpoints?.interrupt && this.device) {
            try {
                await this.device.clearHalt('in', this.endpoints.interrupt.endpointNumber)
            } catch {
                // Expected - transfer may be cancelled
            }
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    /**
     * Start listening for interrupt events
     */
    private startListeningForEvents(): void {
        if (!this.connected || !this.endpoints?.interrupt || this.isListeningForEvents || !this.device) {
            return
        }

        this.isListeningForEvents = true

        console.log('[INTERRUPT] Starting persistent interrupt listener')

        const transfer = this.device.transferIn(this.endpoints.interrupt.endpointNumber, 64)

        transfer
            .then((result: USBInTransferResult) => {
                console.log(`[INTERRUPT] Transfer completed: status=${result.status}`)

                if (result.status === 'stall') {
                    console.log('[INTERRUPT] Endpoint stalled - following PTP recovery procedure')
                    this.handleStallError(EndpointType.INTERRUPT).then(() => {
                        if (this.isListeningForEvents) {
                            this.isListeningForEvents = false
                            this.startListeningForEvents()
                        }
                    })
                } else if (result.status === 'ok' && result.data && result.data.byteLength > 0) {
                    console.log(`[INTERRUPT] Received ${result.data.byteLength} bytes`)
                    const data = new Uint8Array(result.data.buffer)
                    this.handleInterruptData(data)

                    if (this.isListeningForEvents) {
                        this.isListeningForEvents = false
                        this.startListeningForEvents()
                    }
                } else {
                    // Restart listening
                    if (this.isListeningForEvents) {
                        this.isListeningForEvents = false
                        this.startListeningForEvents()
                    }
                }
            })
            .catch((error: unknown) => {
                const message = error instanceof Error ? error.message : String(error)
                if (message.includes('LIBUSB_TRANSFER_CANCELLED')) {
                    console.log('[INTERRUPT] Transfer cancelled')
                    return
                }
                console.log(`[INTERRUPT] Transfer failed: ${message}`)

                if (this.isListeningForEvents) {
                    setTimeout(() => {
                        if (this.isListeningForEvents) {
                            this.isListeningForEvents = false
                            this.startListeningForEvents()
                        }
                    }, 100)
                }
            })
    }

    /**
     * Handle interrupt data
     */
    private handleInterruptData(data: Uint8Array): void {
        if (!this.endpoints?.interrupt) {
            return
        }

        const eventContainer = USBContainerBuilder.parseEvent(data)

        const event: PTPEvent = {
            code: eventContainer.code,
            transactionId: eventContainer.transactionId,
            parameters: [],
        }

        const view = new DataView(
            eventContainer.payload.buffer,
            eventContainer.payload.byteOffset,
            eventContainer.payload.byteLength
        )

        let offset = 0
        while (offset + 4 <= eventContainer.payload.length && event.parameters.length < 5) {
            event.parameters.push(view.getUint32(offset, true))
            offset += 4
        }

        this.logger.addLog({
            type: 'usb_transfer',
            level: 'info',
            bytes: data.length,
            direction: 'receive',
            endpoint: 'interrupt',
            endpointAddress: `0x${this.endpoints.interrupt.endpointNumber.toString(16)}`,
            sessionId: event.transactionId >> 16,
            transactionId: event.transactionId,
            phase: 'response',
        })

        this.eventHandlers.forEach(handler => handler(event))
    }
}

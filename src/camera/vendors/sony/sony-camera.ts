import { ProtocolInterface } from '../../../core/interfaces/protocol.interface'
import { GenericPTPCamera } from '../../generic/generic-ptp-camera'
import { SonyPropertyMapper } from './sony-property-mapper'
import { SonyAuthenticator, SonyAuthenticatorInterface } from './sony-authenticator'
import { SonyOperations, SonyDeviceProperties, SonyConstants } from './sony-constants'
import { DeviceProperty, PropertyValue } from '../../properties/device-properties'
import { LiveViewFrame, FrameFormat } from '../../interfaces/liveview.interface'
import { ImageData, ImageFormat, ImageInfo } from '../../interfaces/image.interface'
import { PTPOperations, PTPResponses } from '../../../core/ptp/ptp-constants'

// Data type constants
const PTPDataTypes = {
    INT8: 0x0001,
    UINT8: 0x0002,
    INT16: 0x0003,
    UINT16: 0x0004,
    INT32: 0x0005,
    UINT32: 0x0006,
    INT64: 0x0007,
    UINT64: 0x0008,
    INT128: 0x000a,
    UINT128: 0x000b,
    STRING: 0xffff,
}

// Sony property info interface
interface SonyPropertyInfo {
    propertyCode: number
    dataType: number
    getSet: number
    isEnabled: number
    currentValue: any
    formFlag: number
    nextOffset: number
    enumValuesSet?: any[]
    enumValuesGetSet?: any[]
}

/**
 * Read a property value from a DataView based on PTP data type
 */
function readValue(view: DataView, offset: number, dataType: number): { value: any; size: number } {
    switch (dataType) {
        case PTPDataTypes.INT8:
            return { value: view.getInt8(offset), size: 1 }
        case PTPDataTypes.UINT8:
            return { value: view.getUint8(offset), size: 1 }
        case PTPDataTypes.INT16:
            return { value: view.getInt16(offset, true), size: 2 }
        case PTPDataTypes.UINT16:
            return { value: view.getUint16(offset, true), size: 2 }
        case PTPDataTypes.INT32:
            return { value: view.getInt32(offset, true), size: 4 }
        case PTPDataTypes.UINT32:
            return { value: view.getUint32(offset, true), size: 4 }
        case PTPDataTypes.INT64:
            return { value: Number(view.getBigInt64(offset, true)), size: 8 }
        case PTPDataTypes.UINT64:
            return { value: Number(view.getBigUint64(offset, true)), size: 8 }
        case PTPDataTypes.INT128:
        case PTPDataTypes.UINT128:
            return { value: BigInt(0), size: 16 } // BigInt zero for 128-bit
        case PTPDataTypes.STRING: {
            // Read null-terminated UTF-16LE string
            const numChars = view.getUint8(offset)
            offset += 1
            let str = ''
            for (let i = 0; i < numChars; i++) {
                const char = view.getUint16(offset, true)
                if (char === 0) break
                str += String.fromCharCode(char)
                offset += 2
            }
            return { value: str, size: 1 + numChars * 2 }
        }
        default:
            // Handle arrays
            if ((dataType & 0x4000) === 0x4000) {
                const count = view.getUint32(offset, true)
                offset += 4
                const baseType = dataType & 0x3fff
                const values = []
                let totalSize = 4
                for (let i = 0; i < count; i++) {
                    const result = readValue(view, offset, baseType)
                    values.push(result.value)
                    offset += result.size
                    totalSize += result.size
                }
                return { value: values, size: totalSize }
            }
            return { value: null, size: 4 }
    }
}

/**
 * Sony camera implementation
 * Extends GenericPTPCamera with Sony-specific functionality
 */
export class SonyCamera extends GenericPTPCamera {
    private readonly sonyAuthenticator: SonyAuthenticatorInterface
    private lastLiveViewTime = 0
    private cachedProperties: Map<number, any> | null = null
    private propertiesLastFetched = 0
    private readonly PROPERTIES_CACHE_TTL = 5000 // 5 seconds

    constructor(protocol: ProtocolInterface, sonyAuthenticator?: SonyAuthenticatorInterface) {
        super(protocol, new SonyPropertyMapper())
        this.sonyAuthenticator = sonyAuthenticator || new SonyAuthenticator()
    }

    async connect(): Promise<void> {
        // Try to close any existing session first
        try {
            await this.protocol.closeSession()
        } catch {
            // Ignore if no session was open
        }

        await this.protocol.openSession(this.sessionId)
        await this.sonyAuthenticator.authenticate(this.protocol)
        this.connected = true
    }

    async captureImage(): Promise<void> {
        // Configure camera for shooting
        await this.configureStillShooting()
        await this.sleep(500)

        // Execute 4-step shooting sequence
        await this.executeShootingSequence()
    }

    async enableLiveView(): Promise<void> {
        // Enable live view using control command
        const controlData = new Uint8Array(2)
        new DataView(controlData.buffer).setUint16(0, SonyConstants.LIVE_VIEW_ENABLE, true)

        await this.protocol.sendOperation({
            code: SonyOperations.CONTROL_DEVICE_PROPERTY,
            parameters: [SonyDeviceProperties.LIVE_VIEW_CONTROL],
            hasDataPhase: true,
            data: controlData,
        })

        // Wait for live view to activate
        await this.sleep(1000)
        this.liveViewActive = true
    }

    async disableLiveView(): Promise<void> {
        const controlData = new Uint8Array(2)
        new DataView(controlData.buffer).setUint16(0, SonyConstants.LIVE_VIEW_DISABLE, true)

        await this.protocol.sendOperation({
            code: SonyOperations.CONTROL_DEVICE_PROPERTY,
            parameters: [SonyDeviceProperties.LIVE_VIEW_CONTROL],
            hasDataPhase: true,
            data: controlData,
        })

        this.liveViewActive = false
    }

    async getLiveViewFrame(): Promise<LiveViewFrame> {
        if (!this.liveViewActive) {
            throw new Error('Live view is not active')
        }

        // Respect 30fps maximum (33ms minimum between requests)
        const now = Date.now()
        const timeSinceLastRequest = now - this.lastLiveViewTime
        if (timeSinceLastRequest < 33) {
            const waitTime = 33 - timeSinceLastRequest
            await this.sleep(waitTime)
        }
        this.lastLiveViewTime = Date.now()

        // Get object info for live view image
        const infoResponse = await this.protocol.sendOperation({
            code: PTPOperations.GET_OBJECT_INFO,
            parameters: [SonyConstants.LIVE_VIEW_IMAGE_HANDLE],
        })

        const width = 1920
        const height = 1080

        if (infoResponse.data && infoResponse.data.length > 12) {
            const view = new DataView(infoResponse.data.buffer, infoResponse.data.byteOffset + 12)
            const imageSize = view.getUint32(8, true)
            console.log(`Image size: ${imageSize} bytes`)

            // Don't read width/height from info - they're not reliable
            // We'll use defaults or get them from the actual JPEG
        }

        // Get the actual live view image with retry on Access_Denied
        let imageData: Uint8Array | null = null
        let retryCount = 0
        const maxRetries = 3

        while (!imageData && retryCount < maxRetries) {
            const response = await this.protocol.sendOperation({
                code: PTPOperations.GET_OBJECT,
                parameters: [SonyConstants.LIVE_VIEW_IMAGE_HANDLE],
                maxDataLength: 5 * 1024 * 1024, // 5MB buffer for live view
            })

            if (response.code === SonyConstants.ACCESS_DENIED) {
                retryCount++
                await this.sleep(50)
                continue
            }

            if (response.code === PTPResponses.OK && response.data) {
                imageData = response.data
                break
            }

            retryCount++
        }

        if (!imageData) {
            throw new Error('Failed to get live view image after retries')
        }

        // The imageData is already parsed without PTP container header
        const liveViewDataset = imageData
        console.log(`Live view dataset length: ${liveViewDataset.length}`)
        if (liveViewDataset.length > 20) {
            console.log(
                `First 20 bytes of dataset: ${Array.from(liveViewDataset.slice(0, 20))
                    .map(b => `0x${b.toString(16).padStart(2, '0')}`)
                    .join(' ')}`
            )
        }

        const parsed = this.parseLiveViewDataset(liveViewDataset)

        if (!parsed) {
            throw new Error('Failed to parse LiveView Dataset')
        }

        // It's OK if the JPEG is empty - camera might not be ready
        if (parsed.jpeg.length === 0) {
            console.log('Live view frame is empty (camera may not be ready)')
            return {
                data: new Uint8Array(0),
                width: width || 1920,
                height: height || 1080,
                format: FrameFormat.JPEG,
                timestamp: Date.now(),
            }
        }

        return {
            data: parsed.jpeg,
            width: width || parsed.width || 1920,
            height: height || parsed.height || 1080,
            format: FrameFormat.JPEG,
            timestamp: Date.now(),
        }
    }

    // Sony-specific methods

    async setOSDMode(enabled: boolean): Promise<boolean> {
        try {
            const osdValue = enabled ? 0x01 : 0x00
            const osdData = new Uint8Array(1)
            osdData[0] = osdValue

            // Send SET_DEVICE_PROPERTY_VALUE command with data
            await this.setPropertyValue(SonyDeviceProperties.OSD_IMAGE_MODE, osdData)

            return true
        } catch (error) {
            console.log(`Failed to set OSD mode: ${String(error)}`)
            return false
        }
    }

    async getOSDImage(): Promise<ImageData> {
        // Ensure OSD mode is enabled
        await this.setOSDMode(true)
        await this.sleep(100)

        // Send GetOSDImage command
        const response = await this.protocol.sendOperation({
            code: SonyOperations.SDIO_GET_OSD_IMAGE,
            parameters: [],
            hasDataPhase: true,
            maxDataLength: 512 * 1024, // 512KB buffer for OSD images
        })

        if (response.code !== PTPResponses.OK) {
            throw new Error(`GetOSDImage failed with code 0x${response.code.toString(16)}`)
        }

        if (!response.data || response.data.length === 0) {
            throw new Error('No OSD image data received')
        }

        // The data is already parsed without PTP container header
        const pngData = this.parseOSDDataset(response.data)

        if (!pngData) {
            throw new Error('Failed to extract PNG from OSD data')
        }

        return {
            data: pngData,
            format: ImageFormat.PNG,
            width: 0, // Will be determined from PNG
            height: 0,
        }
    }

    async getCameraSettings(): Promise<{
        aperture: string
        shutterSpeed: string
        iso: string
    }> {
        // Ensure we have fresh property data
        await this.refreshPropertiesIfNeeded()

        if (!this.cachedProperties) {
            throw new Error('Failed to get camera settings')
        }

        // Extract values from cached properties
        const aperture = this.extractPropertyValue(SonyDeviceProperties.F_NUMBER)
        const shutterSpeed = this.extractPropertyValue(SonyDeviceProperties.SHUTTER_SPEED)
        const iso = this.extractPropertyValue(SonyDeviceProperties.ISO_SENSITIVITY)

        return {
            aperture: aperture ? this.formatAperture(aperture) : 'Unknown',
            shutterSpeed: shutterSpeed ? this.formatShutterSpeed(shutterSpeed) : 'Unknown',
            iso: iso ? this.formatISO(iso) : 'Unknown',
        }
    }

    /**
     * Override getDeviceProperty to use Sony's approach
     */
    async getDeviceProperty(property: DeviceProperty): Promise<PropertyValue> {
        // Refresh properties if needed
        await this.refreshPropertiesIfNeeded()

        if (!this.cachedProperties) {
            throw new Error('Failed to get device properties')
        }

        // Map generic property to Sony property code
        const vendorCode = this.propertyMapper.mapToVendor(property)
        console.log(`Looking for property ${property} with vendor code 0x${vendorCode.toString(16)}`)

        // Extract value from cached properties
        const rawValue = this.extractPropertyValue(vendorCode)

        if (rawValue === undefined) {
            // Return a default value for missing properties
            console.log(`Warning: Property ${property} (0x${vendorCode.toString(16)}) not found, using default`)

            // Return sensible defaults based on property type
            switch (property) {
                case DeviceProperty.SHUTTER_SPEED:
                    return '1/60' // Default shutter speed
                case DeviceProperty.APERTURE:
                    return 'f/2.8' // Default aperture
                case DeviceProperty.ISO:
                    return 'AUTO' // Default ISO
                default:
                    return 'N/A'
            }
        }

        // Parse and return the value
        return this.propertyMapper.parseValue(property, rawValue)
    }

    async getPhoto(): Promise<ImageData & { filename: string }> {
        // Give camera a moment to finalize the capture
        await this.sleep(1000)

        // Get object info
        const infoResponse = await this.protocol.sendOperation({
            code: PTPOperations.GET_OBJECT_INFO,
            parameters: [SonyConstants.RECENT_IMAGE_HANDLE],
        })

        let filename = 'captured_image.jpg'
        let fileSize = 0
        let objectFormat = 0

        if (infoResponse.data && infoResponse.data.length > 12) {
            const view = new DataView(infoResponse.data.buffer, infoResponse.data.byteOffset + 12)
            objectFormat = view.getUint16(4, true)
            fileSize = view.getUint32(8, true)
            console.log(`File size: ${fileSize} bytes`)

            // Determine file extension based on object format
            let extension = '.jpg'
            if (objectFormat === 0xb101) {
                extension = '.arw' // Sony RAW
            } else if (objectFormat === 0x3802) {
                extension = '.tiff'
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
            filename = `IMG_${timestamp}${extension}`
        }

        // Get the actual image data
        // WebUSB has a 32MB limit, so cap our request
        const MAX_SAFE_TRANSFER = 30 * 1024 * 1024; // 30MB to be safe
        const requestSize = fileSize > 0 ? Math.min(fileSize + 1024, MAX_SAFE_TRANSFER) : MAX_SAFE_TRANSFER;
        
        const response = await this.protocol.sendOperation({
            code: PTPOperations.GET_OBJECT,
            parameters: [SonyConstants.RECENT_IMAGE_HANDLE],
            maxDataLength: requestSize,
        })

        if (response.code !== PTPResponses.OK || !response.data) {
            throw new Error('Failed to download image')
        }

        // The data is already parsed without PTP container header
        const imageBytes = response.data

        return {
            data: imageBytes,
            format: objectFormat === 0xb101 ? ImageFormat.RAW : ImageFormat.JPEG,
            width: 0, // TODO: Parse from EXIF
            height: 0,
            filename,
            handle: SonyConstants.RECENT_IMAGE_HANDLE,
        }
    }
    
    /**
     * Override listImages for Sony cameras
     * When save destination is set to host, images are not stored on SD card
     * Instead, we return a special entry for the recent image
     */
    async listImages(): Promise<ImageInfo[]> {
        // When save destination is set to host, we can't list images normally
        // Return a placeholder for the most recent image
        console.log('[Sony] listImages called - returning recent image placeholder')
        return [{
            handle: SonyConstants.RECENT_IMAGE_HANDLE,
            storageId: 0,
            objectFormat: 0x3801, // JPEG
            protectionStatus: 0,
            objectCompressedSize: 0,
            thumbFormat: 0,
            thumbCompressedSize: 0,
            thumbPixWidth: 0,
            thumbPixHeight: 0,
            imagePixWidth: 0,
            imagePixHeight: 0,
            imageBitDepth: 0,
            parentObject: 0,
            associationType: 0,
            associationDescription: 0,
            sequenceNumber: 0,
            filename: 'recent_capture.jpg',
            captureDate: new Date(),
            modificationDate: new Date(),
        }]
    }
    
    /**
     * Override downloadImage for Sony cameras
     * Handle the special RECENT_IMAGE_HANDLE
     */
    async downloadImage(handle: number): Promise<ImageData> {
        if (handle === SonyConstants.RECENT_IMAGE_HANDLE) {
            console.log('[Sony] Downloading recent image')
            const photo = await this.getPhoto()
            return {
                data: photo.data,
                format: photo.format,
                width: photo.width,
                height: photo.height,
                handle,
            }
        }
        
        // Fall back to parent implementation for other handles
        return super.downloadImage(handle)
    }

    // Private helper methods

    /**
     * Set a Sony device property value
     */
    private async setPropertyValue(propCode: number, value: number | Uint8Array): Promise<void> {
        // Convert number to Uint8Array if needed
        let data: Uint8Array
        if (typeof value === 'number') {
            data = new Uint8Array(1)
            data[0] = value
        } else {
            data = value
        }

        // Send SET_DEVICE_PROPERTY_VALUE command with data
        await this.protocol.sendOperation({
            code: SonyOperations.SET_DEVICE_PROPERTY_VALUE,
            parameters: [propCode],
            data: data,
            hasDataPhase: true,
        })
    }

    private async configureStillShooting(): Promise<void> {
        // Set Dial Mode to Host Control
        await this.setPropertyValue(SonyDeviceProperties.DIAL_MODE, new Uint8Array([SonyConstants.DIAL_MODE_HOST]))

        // Set Operating Mode to Still Shooting
        const stillModeData = new Uint8Array(4)
        new DataView(stillModeData.buffer).setUint32(0, SonyConstants.STILL_CAPTURE_MODE, true)
        await this.setPropertyValue(SonyDeviceProperties.STILL_CAPTURE_MODE, stillModeData)

        // Set Save Media to Host Device
        const saveMediaData = new Uint8Array(2)
        new DataView(saveMediaData.buffer).setUint16(0, SonyConstants.SAVE_MEDIA_HOST, true)
        await this.setPropertyValue(SonyDeviceProperties.SAVE_MEDIA, saveMediaData)
    }

    private async executeShootingSequence(): Promise<void> {
        // Step 1: Half-press shutter button (initiate autofocus/metering)
        await this.sendControlCommand(SonyDeviceProperties.SHUTTER_BUTTON_CONTROL, SonyConstants.SHUTTER_HALF_PRESS)
        await this.sleep(500)

        // Step 2: Half-press focus button (additional focus confirmation)
        await this.sendControlCommand(SonyDeviceProperties.FOCUS_BUTTON_CONTROL, SonyConstants.FOCUS_HALF_PRESS)
        await this.sleep(500)

        // Step 3: Release focus button
        await this.sendControlCommand(SonyDeviceProperties.FOCUS_BUTTON_CONTROL, SonyConstants.FOCUS_RELEASE)
        await this.sleep(500)

        // Step 4: Full-press shutter button (capture image)
        await this.sendControlCommand(SonyDeviceProperties.SHUTTER_BUTTON_CONTROL, SonyConstants.SHUTTER_FULL_PRESS)
        await this.sleep(500)
    }

    private async sendControlCommand(propCode: number, value: number): Promise<void> {
        const data = new Uint8Array(2)
        new DataView(data.buffer).setUint16(0, value, true)

        await this.protocol.sendOperation({
            code: SonyOperations.CONTROL_DEVICE_PROPERTY,
            parameters: [propCode],
            hasDataPhase: true,
            data,
        })
    }

    private parseLiveViewDataset(data: Uint8Array): {
        jpeg: Uint8Array
        width?: number
        height?: number
    } | null {
        if (data.length < 16) {
            return null
        }

        const view = new DataView(data.buffer, data.byteOffset)
        const offsetToImage = view.getUint32(0, true)
        const imageSize = view.getUint32(4, true)

        console.log(`LiveView dataset: offset=${offsetToImage}, size=${imageSize}, dataLength=${data.length}`)

        // Validate offsets and size
        if (imageSize === 0) {
            // No image data yet, return empty frame
            return { jpeg: new Uint8Array(0) }
        }

        if (offsetToImage >= data.length || offsetToImage + imageSize > data.length) {
            console.log(`Invalid offsets: offset=${offsetToImage}, size=${imageSize}, dataLength=${data.length}`)
            return null
        }

        // Extract JPEG data
        const jpeg = data.slice(offsetToImage, offsetToImage + imageSize)

        // Verify it's a JPEG (starts with FFD8)
        if (jpeg.length >= 2 && jpeg[0] === 0xff && jpeg[1] === 0xd8) {
            console.log(`Valid JPEG found: ${jpeg.length} bytes`)
        }

        return { jpeg }
    }

    private parseOSDDataset(data: Uint8Array): Uint8Array | null {
        if (data.length < 20) {
            return null
        }

        const view = new DataView(data.buffer, data.byteOffset)
        const offsetToImage = view.getUint32(0, true)
        const imageSize = view.getUint32(4, true)

        // Validate offsets
        if (offsetToImage >= data.length || offsetToImage + imageSize > data.length) {
            return null
        }

        // Extract PNG data
        return data.slice(offsetToImage, offsetToImage + imageSize)
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Refresh properties cache if needed
     */
    private async refreshPropertiesIfNeeded(): Promise<void> {
        const now = Date.now()
        if (!this.cachedProperties || now - this.propertiesLastFetched > this.PROPERTIES_CACHE_TTL) {
            await this.getAllExtDevicePropInfo()
            this.propertiesLastFetched = now
        }
    }

    /**
     * Get all extended device property info (Sony-specific)
     */
    private async getAllExtDevicePropInfo(): Promise<void> {
        // Send GET_ALL_EXT_DEVICE_PROP_INFO command
        const response = await this.protocol.sendOperation({
            code: SonyOperations.GET_ALL_EXT_DEVICE_PROP_INFO,
            parameters: [0, 1], // [Get all data, Enable extended info]
            hasDataPhase: true,
            maxDataLength: 10 * 1024 * 1024, // 10MB buffer for property data
        })

        if (response.code !== PTPResponses.OK) {
            throw new Error(`Failed to get extended device properties: 0x${response.code.toString(16)}`)
        }

        if (!response.data || response.data.length < 12) {
            throw new Error('No property data received')
        }

        console.log(`Received ${response.data.length} bytes for GET_ALL_EXT_DEVICE_PROP_INFO`)
        console.log(
            `First 20 bytes: ${Array.from(response.data.slice(0, 20))
                .map(b => `0x${b.toString(16).padStart(2, '0')}`)
                .join(' ')}`
        )

        // Parse the properties
        this.cachedProperties = this.parseAllExtDevicePropInfo(response.data)

        // Log what properties we found
        console.log(`Parsed ${this.cachedProperties.size} properties out of ${370}`)
        const importantProps = [0xd21e, 0xd20d, 0x5007] // ISO, Shutter, Aperture
        for (const prop of importantProps) {
            if (this.cachedProperties.has(prop)) {
                console.log(`  Found property 0x${prop.toString(16)}: ${this.cachedProperties.get(prop).currentValue}`)
            } else {
                console.log(`  Missing property 0x${prop.toString(16)}`)
            }
        }

        // Debug: Show all property codes we found
        if (this.cachedProperties.size < 100) {
            const allCodes = Array.from(this.cachedProperties.keys())
                .map(c => `0x${c.toString(16)}`)
                .join(', ')
            console.log(`All property codes found: ${allCodes}`)
        }
    }

    /**
     * Parse the extended device property info response
     */
    private parseAllExtDevicePropInfo(data: Uint8Array): Map<number, any> {
        const properties = new Map<number, any>()

        // Skip PTP header (12 bytes)
        const dataset = data.slice(12)
        const view = new DataView(dataset.buffer, dataset.byteOffset)

        // Skip number of elements (UINT64)
        view.getBigUint64(0, true)

        let offset = 8 // Start after numElements
        let successCount = 0
        let failCount = 0

        // Parse properties until we run out of data
        // Don't rely on numElements as the loop counter since parsing can fail
        while (offset < dataset.length - 6 && successCount + failCount < 1000) {
            try {
                // Make sure we have at least minimum bytes for a property
                if (offset + 8 > dataset.length) {
                    break
                }

                const propInfo = this.parseSDIExtDevicePropInfo(dataset, offset)
                if (propInfo) {
                    properties.set(propInfo.propertyCode, propInfo)
                    offset = propInfo.nextOffset
                    successCount++

                    // Verbose logging handled elsewhere if needed
                } else {
                    // Failed to parse, try small increment for recovery
                    // Using 2-byte increment to find properties at odd offsets
                    offset += 2
                    failCount++
                }
            } catch (e: any) {
                // Try simple recovery with 2-byte increment
                offset += 2
                failCount++
            }
        }

        return properties
    }

    /**
     * Parse Sony SDIO Extended Device Property Info dataset
     * Handles the Sony-specific format with reserved bytes between header and values
     */
    parseSDIExtDevicePropInfo(data: Uint8Array, startOffset: number): SonyPropertyInfo | null {
        try {
            // Ensure we have enough data
            if (startOffset + 8 > data.length) {
                return null
            }

            const view = new DataView(data.buffer, data.byteOffset + startOffset)
            let offset = 0

            // Read header fields
            const propertyCode = view.getUint16(offset, true)
            offset += 2

            // Validate property code - be strict about what's valid
            // Valid ranges: standard PTP or vendor-specific
            if (
                !(
                    (propertyCode >= SonyConstants.PTP_PROP_MIN && propertyCode <= SonyConstants.PTP_PROP_MAX) ||
                    (propertyCode >= SonyConstants.VENDOR_PROP_MIN && propertyCode <= SonyConstants.VENDOR_PROP_MAX)
                )
            ) {
                return null
            }

            const dataType = view.getUint16(offset, true)
            offset += 2

            // Validate data type - be strict
            // Valid types: basic, array, or string
            if (
                !(
                    (dataType >= SonyConstants.DATA_TYPE_MIN && dataType <= SonyConstants.DATA_TYPE_MAX) ||
                    (dataType >= SonyConstants.DATA_TYPE_ARRAY_MIN && dataType <= SonyConstants.DATA_TYPE_ARRAY_MAX) ||
                    dataType === SonyConstants.DATA_TYPE_STRING
                )
            ) {
                return null
            }

            const getSet = view.getUint8(offset)
            offset += 1

            const isEnabled = view.getUint8(offset)
            offset += 1

            // CRITICAL: Skip reserved bytes based on data type
            // Sony inserts reserved bytes between header fields and values
            const reservedSize = this.getReservedSize(dataType)
            offset += reservedSize

            // Read current value
            const { value: currentValue, size: currentSize } = this.readPropertyValue(view, offset, dataType)
            offset += currentSize

            // Read form flag
            const formFlag = view.getUint8(offset)
            offset += 1

            const result: SonyPropertyInfo = {
                propertyCode,
                dataType,
                getSet,
                isEnabled,
                currentValue,
                formFlag,
                nextOffset: startOffset + offset,
            }

            // Parse enumeration if present
            if (formFlag === 0x02) {
                // Read Set enumeration
                const numEnumSet = view.getUint16(offset, true)
                offset += 2

                result.enumValuesSet = []
                for (let i = 0; i < numEnumSet; i++) {
                    const { value, size } = this.readPropertyValue(view, offset, dataType)
                    result.enumValuesSet.push(value)
                    offset += size
                }

                // Read GetSet enumeration
                const numEnumGetSet = view.getUint16(offset, true)
                offset += 2

                result.enumValuesGetSet = []
                for (let i = 0; i < numEnumGetSet; i++) {
                    const { value, size } = this.readPropertyValue(view, offset, dataType)
                    result.enumValuesGetSet.push(value)
                    offset += size
                }

                result.nextOffset = startOffset + offset
            }

            return result
        } catch (error) {
            return null
        }
    }

    /**
     * Read a property value from a DataView based on PTP data type
     * Wrapper around the shared readValue function
     */
    private readPropertyValue(view: DataView, offset: number, dataType: number): { value: any; size: number } {
        return readValue(view, offset, dataType)
    }

    /**
     * Get reserved bytes size for Sony SDIO properties based on data type
     * Sony inserts reserved bytes between header fields and values
     */
    private getReservedSize(dataType: number): number {
        const basicSize = this.getDataTypeSize(dataType)
        // Sony uses the data type size as reserved bytes for alignment
        return basicSize === 0 && (dataType & 0x4000) === 0x4000 ? 4 : basicSize
    }

    /**
     * Get the size in bytes for a PTP data type
     */
    private getDataTypeSize(dataType: number): number {
        switch (dataType) {
            case PTPDataTypes.INT8:
            case PTPDataTypes.UINT8:
                return 1
            case PTPDataTypes.INT16:
            case PTPDataTypes.UINT16:
                return 2
            case PTPDataTypes.INT32:
            case PTPDataTypes.UINT32:
                return 4
            case PTPDataTypes.INT64:
            case PTPDataTypes.UINT64:
                return 8
            case PTPDataTypes.INT128:
            case PTPDataTypes.UINT128:
                return 16
            case PTPDataTypes.STRING:
                return 0 // Variable length
            default:
                if ((dataType & 0x4000) === 0x4000) {
                    return 0 // Array - variable length
                }
                return 4
        }
    }

    /**
     * Extract a property value from the cached properties
     */
    private extractPropertyValue(propCode: number): any {
        if (!this.cachedProperties) {
            return undefined
        }

        const prop = this.cachedProperties.get(propCode)
        return prop?.currentValue
    }

    /**
     * Format aperture value for display
     */
    private formatAperture(value: number): string {
        if (typeof value === 'number') {
            // Sony stores aperture as value * 100
            const fNumber = value / 100
            return `f/${fNumber.toFixed(1)}`
        }
        return String(value)
    }

    /**
     * Format shutter speed for display
     */
    private formatShutterSpeed(value: any): string {
        if (typeof value === 'number') {
            // Check for special values
            if (value === 0x00000000) return 'BULB'
            if (value === 0xffffffff) return 'N/A'

            // Sony encodes shutter speed as 32-bit value:
            // Upper 16 bits = numerator, Lower 16 bits = denominator
            const numerator = (value >> 16) & 0xffff
            const denominator = value & 0xffff

            if (denominator === 0x000a) {
                // Real number display (e.g., 1.5")
                return `${numerator / 10}"`
            } else if (numerator === 0x0001) {
                // Fraction display (e.g., 1/1000)
                return `1/${denominator}`
            } else if (denominator !== 0) {
                return `${numerator}/${denominator}`
            }
        }
        return 'Unknown'
    }

    /**
     * Format ISO value for display
     */
    private formatISO(value: number): string {
        if (typeof value === 'number') {
            // Special AUTO values
            if (value === 0x00ffffff) return 'AUTO'
            if (value === 0x01ffffff) return 'Multi Frame NR ISO AUTO'
            if (value === 0x02ffffff) return 'Multi Frame NR High ISO AUTO'
            if (value === 0xffffffff) return 'N/A'

            // Check for Multi Frame NR modes (prefix byte)
            const prefix = (value >> 24) & 0xff
            let mode = ''
            if (prefix === 0x01) {
                mode = 'Multi Frame NR '
            } else if (prefix === 0x02) {
                mode = 'Multi Frame NR High '
            }

            // Extract the actual ISO value (lower 24 bits)
            const isoValue = value & 0xffffff

            // Sony uses direct decimal values for ISO
            if (isoValue >= 10 && isoValue <= 1000000) {
                return `${mode}ISO ${isoValue}`
            }
        }
        return 'Unknown'
    }
}

/**
 * NikonCamera - Approach 6 Implementation
 *
 * Extends GenericCamera with Nikon-specific vendor extensions.
 * Accepts definition objects instead of strings with merged generic + Nikon registries.
 */

import { Logger } from '@core/logger'
import { VendorIDs } from '@ptp/definitions/vendor-ids'
import { ISOAutoControl } from '@ptp/definitions/vendors/nikon/nikon-operation-definitions'
import { createNikonRegistry, type NikonRegistry } from '@ptp/registry'
import type { CodecType } from '@ptp/types/codec'
import type { EventData } from '@ptp/types/event'
import type { PropertyDefinition } from '@ptp/types/property'
import { PTPEvent, TransportInterface } from '@transport/interfaces/transport.interface'
import { GenericCamera } from './generic-camera'

// ============================================================================
// NikonCamera class
// ============================================================================

export class NikonCamera extends GenericCamera {
    private liveViewEnabled = false
    vendorId = VendorIDs.NIKON
    declare protected registry: NikonRegistry

    constructor(transport: TransportInterface, logger: Logger) {
        super(transport, logger)
        // Override with Nikon-specific registry
        this.registry = createNikonRegistry(transport.isLittleEndian()) as any
    }

    /**
     * Override get to use Nikon's GetDevicePropDescEx
     * Returns full property descriptor including current value, supported values, etc.
     */
    async get<P extends PropertyDefinition>(property: P): Promise<CodecType<P['codec']>> {
        if (!property.access.includes('Get')) {
            throw new Error(`Property ${property.name} is not readable`)
        }

        // Use GetDevicePropDescEx to get full descriptor including current value
        const response = await this.send(this.registry.operations.GetDevicePropDescEx, {
            DevicePropCode: property.code,
        })

        if (!response.data) {
            throw new Error('No data received from GetDevicePropDescEx')
        }

        // The response contains a full property descriptor
        // Extract current value from descriptor (already decoded by DevicePropDescCodec)
        const descriptor = response.data

        // Type guard to ensure descriptor has currentValueDecoded
        if (!descriptor || typeof descriptor !== 'object' || !('currentValueDecoded' in descriptor)) {
            throw new Error('Invalid property descriptor structure')
        }

        // Cast needed: TypeScript knows data exists but can't narrow to specific property's codec type
        return descriptor.currentValueDecoded as CodecType<P['codec']>
    }

    /**
     * Override set to use Nikon's SetDevicePropValueEx
     */
    async set<P extends PropertyDefinition>(property: P, value: CodecType<P['codec']>): Promise<void> {
        if (!property.access.includes('Set')) {
            throw new Error(`Property ${property.name} is not writable`)
        }

        const codec = this.resolveCodec(property.codec)
        const encodedValue = codec.encode(value)

        await this.send(
            this.registry.operations.SetDevicePropValueEx,
            {
                DevicePropCode: property.code,
            },
            encodedValue
        )
    }

    /**
     * Override on() to accept Nikon events (currently same as generic)
     */
    on(eventName: string, handler: (event: EventData) => void): void {
        this.emitter.on(eventName, handler)
    }

    /**
     * Override off() to accept Nikon events (currently same as generic)
     */
    off(eventName: string, handler?: (event: EventData) => void): void {
        if (handler) {
            this.emitter.off(eventName, handler)
        } else {
            this.emitter.removeAllListeners(eventName)
        }
    }

    /**
     * Handle incoming PTP events from transport (Nikon-specific)
     */
    protected handleEvent(event: PTPEvent): void {
        // Look up event definition by code in merged registry
        const eventDef = Object.values(this.registry.events).find(e => e.code === event.code)
        if (!eventDef) return

        // Emit event parameters as array
        this.emitter.emit(eventDef.name, event.parameters)
    }

    /**
     * Start live view mode
     * Uses Nikon's StartLiveView activation command and DeviceReady polling
     */
    async startLiveView(): Promise<void> {
        // Issue StartLiveView command
        await this.send(this.registry.operations.StartLiveView, {})

        // Poll DeviceReady until camera is ready
        let retries = 0
        const maxRetries = 50 // Max 5 seconds with 100ms delays

        while (retries < maxRetries) {
            const readyResponse = await this.send(this.registry.operations.DeviceReady, {})

            // 0x2001 = OK, camera is ready
            if (readyResponse.code === 0x2001) {
                this.liveViewEnabled = true
                return
            }

            // 0x2019 = Device_Busy, keep polling
            if (readyResponse.code === 0x2019) {
                await new Promise(resolve => setTimeout(resolve, 100))
                retries++
                continue
            }

            // Any other response code indicates an error
            throw new Error(`Failed to start live view: DeviceReady returned code 0x${readyResponse.code.toString(16)}`)
        }

        throw new Error('Timeout waiting for live view to start')
    }

    /**
     * Stop live view mode
     */
    async stopLiveView(): Promise<void> {
        await this.send(this.registry.operations.EndLiveView, {})
        this.liveViewEnabled = false
    }

    /**
     * Set ISO sensitivity - Nikon override
     * Handles ISOAutoControl property based on value
     */
    async setIso(value: string): Promise<void> {
        const isAuto = value.toLowerCase().includes('auto')

        if (isAuto) {
            // Enable auto ISO
            return await this.set(ISOAutoControl, 'ON')
        } else {
            // Disable auto ISO, then set specific value
            await this.set(ISOAutoControl, 'OFF')
            return await this.set(this.registry.properties.ExposureIndex, value)
        }
    }

    /**
     * Capture single live view frame
     * Returns both metadata and image data
     */
    async captureLiveView(): Promise<Uint8Array> {
        if (!this.liveViewEnabled) {
            await this.startLiveView()
        }

        const response = await this.send(this.registry.operations.GetLiveViewImageEx, {})
        const liveViewData = response.data

        return liveViewData.liveViewImage || new Uint8Array()
    }
}

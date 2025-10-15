import { Logger } from '@core/logger'
import { DeviceBusy, OK } from '@ptp/definitions/response-definitions'
import { VendorIDs } from '@ptp/definitions/vendor-ids'
import { ISOAutoControl } from '@ptp/definitions/vendors/nikon/nikon-operation-definitions'
import { createNikonRegistry, type NikonRegistry } from '@ptp/registry'
import type { CodecType } from '@ptp/types/codec'
import type { EventData } from '@ptp/types/event'
import type { PropertyDefinition } from '@ptp/types/property'
import { EventNames } from '@ptp/types/type-helpers'
import { TransportInterface } from '@transport/interfaces/transport.interface'
import { GenericCamera } from './generic-camera'

export class NikonCamera extends GenericCamera {
    private liveViewEnabled = false
    vendorId = VendorIDs.NIKON
    declare public registry: NikonRegistry

    constructor(transport: TransportInterface, logger: Logger) {
        super(transport, logger)
        this.registry = createNikonRegistry(transport.isLittleEndian())
    }

    async get<P extends PropertyDefinition>(property: P): Promise<CodecType<P['codec']>> {
        if (!property.access.includes('Get')) {
            throw new Error(`Property ${property.name} is not readable`)
        }

        const response = await this.send(this.registry.operations.GetDevicePropDescEx, {
            DevicePropCode: property.code,
        })

        if (!response.data) {
            throw new Error('No data received from GetDevicePropDescEx')
        }

        const descriptor = response.data

        if (!descriptor || typeof descriptor !== 'object' || !('currentValueDecoded' in descriptor)) {
            throw new Error('Invalid property descriptor structure')
        }

        // Cast needed: TypeScript knows data exists but can't narrow to specific property's codec type
        return descriptor.currentValueDecoded as CodecType<P['codec']>
    }

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

    on<E extends { name: string }>(event: E, handler: (event: EventData) => void): void {
        this.emitter.on(event.name, handler)
    }

    off<E extends { name: string }>(event: E, handler?: (event: EventData) => void): void {
        if (handler) {
            this.emitter.off(event.name, handler)
        } else {
            this.emitter.removeAllListeners(event.name)
        }
    }

    async setIso(value: string): Promise<void> {
        const isAuto = value.toLowerCase().includes('auto')

        if (isAuto) {
            return await this.set(ISOAutoControl, 'ON')
        } else {
            await this.set(ISOAutoControl, 'OFF')
            return await this.set(this.registry.properties.ExposureIndex, value)
        }
    }

    async captureLiveView(): Promise<Uint8Array> {
        if (!this.liveViewEnabled) {
            await this.startLiveView()
        }

        const response = await this.send(this.registry.operations.GetLiveViewImageEx, {})
        const liveViewData = response.data

        return liveViewData.liveViewImage || new Uint8Array()
    }

    async startLiveView(): Promise<void> {
        await this.send(this.registry.operations.StartLiveView, {})

        let retries = 0
        while (retries < 50) {
            const readyResponse = await this.send(this.registry.operations.DeviceReady, {})

            if (readyResponse.code === OK.code) {
                this.liveViewEnabled = true
                return
            }

            if (readyResponse.code === DeviceBusy.code) {
                await new Promise(resolve => setTimeout(resolve, 10))
                retries++
                continue
            }

            throw new Error(`Failed to start live view: DeviceReady returned code 0x${readyResponse.code.toString(16)}`)
        }

        throw new Error('Timeout waiting for live view to start')
    }

    async stopLiveView(): Promise<void> {
        await this.send(this.registry.operations.EndLiveView, {})
        this.liveViewEnabled = false
    }
}

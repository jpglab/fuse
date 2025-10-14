/**
 * Camera Factory
 *
 * High-level Camera class that automatically instantiates the correct camera type
 * (Sony, Nikon, or Generic) based on vendor ID, including transport & logger.
 */

import { Logger } from '@core/logger'
import { VendorIDs } from '@ptp/definitions/vendor-ids'
import type { CodecType } from '@ptp/types/codec'
import type { EventData } from '@ptp/types/event'
import type { OperationDefinition } from '@ptp/types/operation'
import type { PropertyDefinition } from '@ptp/types/property'
import { OperationParams, OperationResponse } from '@ptp/types/type-helpers'
import { DeviceDescriptor } from '@transport/interfaces/device.interface'
import { TransportInterface } from '@transport/interfaces/transport.interface'
import { GenericCamera } from './generic-camera'
import { NikonCamera } from './nikon-camera'
import { SonyCamera } from './sony-camera'

/**
 * Factory function to create the appropriate camera instance based on vendor ID
 *
 * @param vendorId - USB vendor ID of the camera manufacturer
 * @param transport - Transport interface for communication
 * @param logger - Logger instance for tracking operations
 * @returns Appropriate camera instance (SonyCamera, NikonCamera, or GenericCamera)
 */
export function createCamera(vendorId: number, transport: TransportInterface, logger: Logger): GenericCamera {
    switch (vendorId) {
        case VendorIDs.SONY:
            return new SonyCamera(transport, logger)
        case VendorIDs.NIKON:
            return new NikonCamera(transport, logger)
        default:
            return new GenericCamera(transport, logger)
    }
}

/**
 * Camera class - high-level factory wrapper
 *
 * Provides a unified interface for creating camera instances.
 * Automatically selects the correct camera implementation based on vendor ID.
 */
export class Camera {
    private instance: GenericCamera

    constructor(vendorId: number, transport: TransportInterface, logger: Logger) {
        this.instance = createCamera(vendorId, transport, logger)
    }

    /**
     * Get the underlying camera instance
     */
    getInstance(): GenericCamera {
        return this.instance
    }

    // Proxy common methods to the instance with proper types
    async connect(deviceIdentifier?: DeviceDescriptor): Promise<void> {
        return this.instance.connect(deviceIdentifier)
    }

    async disconnect(): Promise<void> {
        return this.instance.disconnect()
    }

    async send<Op extends OperationDefinition>(
        operation: Op,
        params: OperationParams<Op>,
        data?: Uint8Array,
        maxDataLength?: number
    ): Promise<OperationResponse<Op>> {
        return this.instance.send(operation, params, data, maxDataLength)
    }

    async get<P extends PropertyDefinition>(property: P): Promise<CodecType<P['codec']>> {
        return this.instance.get(property)
    }

    async set<P extends PropertyDefinition>(property: P, value: CodecType<P['codec']>): Promise<void> {
        return this.instance.set(property, value)
    }

    on(eventName: string, handler: (event: EventData) => void): void {
        return this.instance.on(eventName, handler)
    }

    off(eventName: string, handler?: (event: EventData) => void): void {
        return this.instance.off(eventName, handler)
    }

    async getAperture(): Promise<string> {
        return this.instance.getAperture()
    }

    async setAperture(value: string): Promise<void> {
        return this.instance.setAperture(value)
    }

    async getShutterSpeed(): Promise<string> {
        return this.instance.getShutterSpeed()
    }

    async setShutterSpeed(value: string): Promise<void> {
        return this.instance.setShutterSpeed(value)
    }

    async getIso(): Promise<string> {
        return this.instance.getIso()
    }

    async setIso(value: string): Promise<void> {
        return this.instance.setIso(value)
    }

    async captureImage(): Promise<{ info: any; data: Uint8Array } | null> {
        return this.instance.captureImage()
    }

    async captureLiveView(): Promise<Uint8Array> {
        return this.instance.captureLiveView()
    }

    async startRecording(): Promise<void> {
        return this.instance.startRecording()
    }

    async stopRecording(): Promise<void> {
        return this.instance.stopRecording()
    }
}

// Re-export camera classes for direct use if needed
export { GenericCamera } from './generic-camera'
export { NikonCamera } from './nikon-camera'
export { SonyCamera } from './sony-camera'

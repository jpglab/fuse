import { TransportOptions } from '@transport/interfaces/transport-types'
import { ObjectInfoParsed } from '@camera/generic/object-info-dataset'

/**
 * Camera connection options
 * Extends TransportOptions with camera-specific settings
 */
export interface CameraOptions extends TransportOptions {
    vendor?: string
    model?: string
    serialNumber?: string

    usb?: {
        vendorId?: number
        productId?: number
    }
    ip?: {
        host: string
        port?: number
        protocol?: 'ptp/ip' | 'upnp'
    }
}

/**
 * Camera interface - Simplified V7 Architecture
 * Core operations only
 */
export interface CameraInterface {
    /**
     * Connect to the camera
     */
    connect(): Promise<void>

    /**
     * Disconnect from the camera
     */
    disconnect(): Promise<void>

    /**
     * Check if connected
     */
    isConnected(): boolean

    /**
     * Capture a still image
     */
    captureImage(): Promise<{ info: ObjectInfoParsed; data: Uint8Array } | null>

    /**
     * Get a device property value by name (type-safe with constants)
     * @param propertyName - Name of the property from constants
     */
    getDeviceProperty<T = any>(propertyName: string): Promise<T>

    /**
     * Set a device property value by name (type-safe with constants)
     * @param propertyName - Name of the property from constants
     * @param value - Value to set
     */
    setDeviceProperty(propertyName: string, value: any): Promise<void>

    /**
     * Get camera information
     */
    getCameraInfo(): Promise<CameraInfo>

    /**
     * Capture a live view frame
     * Automatically handles enabling/disabling live view as needed
     */
    captureLiveView(): Promise<{ info: ObjectInfoParsed; data: Uint8Array } | null>

    /**
     * Stream a live view frame
     */
    streamLiveView(): Promise<Uint8Array>

    /**
     * Stream an OSD (On-Screen Display) frame
     */
    streamOSD(): Promise<Uint8Array>
}

/**
 * Camera information
 */
export interface CameraInfo {
    manufacturer: string
    model: string
    serialNumber: string
    firmwareVersion: string
    batteryLevel: number
}

/**
 * Storage information
 */
export interface StorageInfo {
    id: string
    name: string
    type: number
    totalSpace: number
    freeSpace: number
}

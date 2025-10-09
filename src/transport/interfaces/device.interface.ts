/**
 * Device-related interfaces and types
 */

import { TransportType } from './transport-types'

/**
 * Unified device descriptor - comprehensive device/camera information
 * Used across all layers (transport, camera, client) for consistency
 */
export interface DeviceDescriptor {
    // Core identifiers
    vendorId?: number
    productId?: number
    serialNumber?: string

    // Device metadata
    manufacturer?: string
    model?: string // Replaces 'product' for consistency
    vendor?: string // Alias for manufacturer (client compatibility)

    // Connection details (supports multiple transports)
    usb?: {
        vendorId: number
        productId: number
        path?: string // USB device path
    }
    ip?: {
        host: string // IP address
        port?: number // Network port (defaults to standard PTP/IP port)
        protocol?: 'ptp/ip' | 'upnp'
    }

    // Camera-specific information (populated after connection)
    firmwareVersion?: string
    batteryLevel?: number

    // Transport type hint
    transportType?: TransportType

    // Raw device object (platform-specific, e.g., USBDevice)
    device?: unknown
}

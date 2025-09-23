/**
 * Unified device identification and description interfaces
 */

/**
 * Device descriptor - comprehensive device information
 * Used for device discovery and identification
 */
export interface DeviceDescriptor {
    // Core identifiers
    vendorId: number
    productId: number
    serialNumber?: string
    
    // Device metadata
    manufacturer?: string
    product?: string
    
    // Connection-specific details
    path?: string           // USB device path
    address?: string         // IP address or Bluetooth MAC
    port?: number           // Network port
    
    // Raw device object (platform-specific)
    device?: unknown
}

/**
 * Device search criteria for finding devices
 */
export interface DeviceSearchCriteria {
    vendorId?: number
    productId?: number
    class?: number
    subclass?: number
    protocol?: number
    serialNumber?: string
}

/**
 * Transport type enumeration
 */
export enum TransportType {
    USB = 'usb',
    IP = 'ip',
    BLUETOOTH = 'bluetooth',
}

/**
 * Transport configuration options
 */
export interface TransportOptions {
    timeout?: number
    maxRetries?: number
    bufferSize?: number
}
/**
 * Transport layer interfaces - consolidated definitions
 */

// ============================================================================
// Device Interfaces
// ============================================================================

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
    model?: string          // Replaces 'product' for consistency
    vendor?: string         // Alias for manufacturer (client compatibility)
    
    // Connection details (supports multiple transports)
    usb?: {
        vendorId: number
        productId: number
        path?: string       // USB device path
    }
    ip?: {
        host: string        // IP address
        port?: number       // Network port (defaults to standard PTP/IP port)
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
}

/**
 * Transport configuration options
 */
export interface TransportOptions {
    timeout?: number
    maxRetries?: number
    bufferSize?: number
}

// ============================================================================
// Transport Interface
// ============================================================================

/**
 * Transport layer interface for device communication
 */
export interface TransportInterface {
    /**
     * Connect to a device
     * @param device - Device descriptor for connection
     */
    connect(device: DeviceDescriptor): Promise<void>

    /**
     * Disconnect from the current device
     */
    disconnect(): Promise<void>

    /**
     * Send data to the connected device
     * @param data - Raw data to send
     */
    send(data: Uint8Array): Promise<void>

    /**
     * Receive data from the connected device
     * @param maxLength - Maximum number of bytes to receive
     * @returns Received data
     */
    receive(maxLength?: number): Promise<Uint8Array>

    /**
     * Check if currently connected to a device
     */
    isConnected(): boolean

    /**
     * Reset the transport connection
     */
    reset(): Promise<void>

    /**
     * Get transport type identifier
     */
    getType(): TransportType

    /**
     * Get connected device information
     */
    getDeviceInfo?(): DeviceDescriptor | null
}

// ============================================================================
// Endpoint Interfaces
// ============================================================================

/**
 * Endpoint management interface for transport implementations
 */
export interface EndpointManagerInterface {
    /**
     * Configure endpoints for a device
     * @param device - Device to configure endpoints for
     */
    configureEndpoints(device: unknown): Promise<EndpointConfiguration>

    /**
     * Release endpoints
     */
    releaseEndpoints(): Promise<void>

    /**
     * Get current endpoint configuration
     */
    getConfiguration(): EndpointConfiguration | null

    /**
     * Clear endpoint halt condition
     * @param endpoint - Endpoint to clear
     */
    clearHalt(endpoint: EndpointType): Promise<void>
}

/**
 * Endpoint configuration
 */
export interface EndpointConfiguration {
    bulkIn: unknown
    bulkOut: unknown
    interrupt?: unknown
}

/**
 * Endpoint types
 */
export enum EndpointType {
    BULK_IN = 'bulk_in',
    BULK_OUT = 'bulk_out',
    INTERRUPT = 'interrupt',
}

/**
 * Device finder interface for locating devices
 */
export interface DeviceFinderInterface {
    /**
     * Find devices matching criteria
     * @param criteria - Search criteria
     */
    findDevices(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor[]>

    /**
     * Request device access (for web environments)
     * @param criteria - Device selection criteria
     */
    requestDevice(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor>

    /**
     * Get list of all available devices
     */
    getAllDevices(): Promise<DeviceDescriptor[]>
}
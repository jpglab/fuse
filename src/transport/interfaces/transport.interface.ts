/**
 * Transport layer interface for device communication
 */
export interface TransportInterface {
    /**
     * Connect to a device
     * @param device - Device identifier for connection
     */
    connect(device: DeviceIdentifier): Promise<void>

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
    getDeviceInfo?(): DeviceIdentifier | null
}

/**
 * Device identifier for transport connections
 */
export interface DeviceIdentifier {
    vendorId: number
    productId: number
    serialNumber?: string
    path?: string
    address?: string
    port?: number
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

export interface CameraOptions {
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

    timeout?: number
}

export interface CameraDescriptor {
    vendor: string
    model: string
    serialNumber?: string

    usb?: {
        vendorId: number
        productId: number
    }
    ip?: {
        host: string
        port: number
    }
}

// Photo and Frame are exported as classes from their respective files
// These interfaces are removed to avoid duplication

// ExposureMode is exported from constants/property-enums.ts to avoid duplication

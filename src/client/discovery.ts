/**
 * Unified discovery functions with runtime detection
 * Automatically handles Node.js (USB) and browser (WebUSB) environments
 */
import { CameraOptions, CameraDescriptor } from './types'

// Runtime environment detection
const isNode = typeof window === 'undefined'
const isWebUSBAvailable = typeof window !== 'undefined' && 'usb' in navigator

// Removed cache - no longer needed since implementation is inline

/**
 * List available cameras
 * - In Node.js: Uses USB device discovery
 * - In browser with WebUSB: Uses WebUSB API (if implemented)
 * - In browser without WebUSB: Throws informative error
 */
export async function listCameras(options?: CameraOptions): Promise<CameraDescriptor[]> {
    if (isNode) {
        // Node.js environment - use USB discovery
        return listCamerasNode(options)
    } else if (isWebUSBAvailable) {
        // Browser with WebUSB support
        // TODO: Implement WebUSB discovery
        throw new Error('WebUSB camera discovery not yet implemented. Please use the Camera constructor directly with a WebUSB device.')
    } else {
        // Browser without WebUSB support
        throw new Error('Camera discovery is not available in this browser. WebUSB API is required.')
    }
}

/**
 * Watch for camera connections/disconnections
 * - In Node.js: Polls USB devices
 * - In browser: Not available (throws error)
 */
export function watchCameras(callback: (cameras: CameraDescriptor[]) => void, options?: CameraOptions): () => void {
    if (!isNode) {
        throw new Error('watchCameras() is not available in browser environment. Use WebUSB events for camera monitoring.')
    }

    const intervalMilliseconds = 1000
    let lastCameraCount = -1

    const checkCameras = async () => {
        try {
            const cameras = await listCameras(options)
            if (cameras.length !== lastCameraCount) {
                lastCameraCount = cameras.length
                callback(cameras)
            }
        } catch (error) {
            console.error('Error watching cameras:', error)
        }
    }

    // Initial check
    checkCameras()

    const interval = setInterval(checkCameras, intervalMilliseconds)

    return () => clearInterval(interval)
}

// Internal function for Node.js discovery (not exported)
async function listCamerasNode(options?: CameraOptions): Promise<CameraDescriptor[]> {
    const { USBDeviceFinder } = await import('@transport/usb/usb-device-finder')
    const { CameraFactory } = await import('@camera/camera-factory')
    
    const deviceFinder = new USBDeviceFinder()
    const cameraFactory = new CameraFactory()

    const searchCriteria = {
        vendorId: options?.usb?.vendorId || 0,
        productId: options?.usb?.productId || 0,
    }

    const devices = await deviceFinder.findDevices(searchCriteria)

    let cameras: CameraDescriptor[] = devices.map(device => {
        const vendor = cameraFactory.detectVendor(device.vendorId)
        return {
            vendor: vendor.charAt(0).toUpperCase() + vendor.slice(1),
            model: 'Camera',
            serialNumber: device.serialNumber,
            usb: {
                vendorId: device.vendorId,
                productId: device.productId,
            },
        }
    })

    if (options?.vendor) {
        cameras = cameras.filter(camera => camera.vendor.toLowerCase() === options.vendor!.toLowerCase())
    }

    if (options?.model) {
        cameras = cameras.filter(camera => camera.model.toLowerCase().includes(options.model!.toLowerCase()))
    }

    if (options?.serialNumber) {
        cameras = cameras.filter(camera => camera.serialNumber === options.serialNumber)
    }

    if (options?.ip) {
        // Future: IP camera discovery will be added here
        // For now, we can manually add IP cameras if specified
        if (options.ip.host) {
            const ipCamera: CameraDescriptor = {
                vendor: options.vendor || 'Unknown',
                model: options.model || 'IP Camera',
                serialNumber: options.serialNumber,
                ip: {
                    host: options.ip.host,
                    port: options.ip.port || 15740,
                },
            }
            cameras.push(ipCamera)
        }
    }

    return cameras
}
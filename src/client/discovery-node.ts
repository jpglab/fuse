/**
 * Node.js-specific discovery functions
 * These functions rely on USB device discovery which requires Node.js USB libraries
 */
import { USBDeviceFinder } from '@transport/usb/usb-device-finder'
import { CameraFactory } from '@camera/camera-factory'
import { CameraOptions, CameraDescriptor } from './types'

export async function listCameras(options?: CameraOptions): Promise<CameraDescriptor[]> {
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
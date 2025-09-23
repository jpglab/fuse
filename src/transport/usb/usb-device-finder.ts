import { DeviceFinderInterface } from '@transport/interfaces/endpoint.interface'
import { DeviceSearchCriteria, DeviceDescriptor } from '@transport/interfaces/device.interface'

/**
 * USB device finder implementation
 */
export class USBDeviceFinder implements DeviceFinderInterface {
    private readonly isWebEnvironment = typeof navigator !== 'undefined' && 'usb' in navigator

    /**
     * Find USB devices matching criteria
     */
    async findDevices(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor[]> {
        if (this.isWebEnvironment) {
            return this.findWebUSBDevices(criteria)
        } else {
            return this.findNodeUSBDevices(criteria)
        }
    }

    /**
     * Request device access (WebUSB only)
     */
    async requestDevice(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor> {
        if (!this.isWebEnvironment) {
            throw new Error('requestDevice is only available in web environments')
        }

        const filters: USBDeviceFilter[] = []
        if (criteria.vendorId !== undefined) {
            filters.push({ vendorId: criteria.vendorId })
        }
        if (criteria.productId !== undefined && criteria.vendorId !== undefined) {
            filters[0] = { ...filters[0], productId: criteria.productId }
        }

        const device = await navigator.usb.requestDevice({ filters })

        return {
            device,
            vendorId: device.vendorId,
            productId: device.productId,
            manufacturer: device.manufacturerName || undefined,
            model: device.productName || undefined,
            serialNumber: device.serialNumber || undefined,
        }
    }

    /**
     * Get all available USB devices
     */
    async getAllDevices(): Promise<DeviceDescriptor[]> {
        if (this.isWebEnvironment) {
            const devices = await navigator.usb.getDevices()
            return devices.map(device => ({
                device,
                vendorId: device.vendorId,
                productId: device.productId,
                manufacturer: device.manufacturerName || undefined,
                model: device.productName || undefined,
                serialNumber: device.serialNumber || undefined,
            }))
        } else {
            const usb = await import('usb')
            const devices = usb.usb.getDeviceList()

            const descriptors: DeviceDescriptor[] = []
            for (const device of devices) {
                const descriptor = device.deviceDescriptor

                // Skip PTP interface check in getAllDevices
                // This is handled by findDevices when criteria is provided

                descriptors.push({
                    device,
                    vendorId: descriptor.idVendor,
                    productId: descriptor.idProduct,
                    manufacturer: undefined, // Would need to read descriptor strings
                    model: undefined, // Would need to read descriptor strings
                    serialNumber: undefined, // Would need to read descriptor strings
                })
            }

            return descriptors
        }
    }

    private async findWebUSBDevices(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor[]> {
        const devices = await navigator.usb.getDevices()

        return devices
            .filter(device => {
                if (criteria.vendorId !== undefined && device.vendorId !== criteria.vendorId) {
                    return false
                }
                if (criteria.productId !== undefined && device.productId !== criteria.productId) {
                    return false
                }
                // WebUSB doesn't easily expose interface class info without opening device
                return true
            })
            .map(device => ({
                device,
                vendorId: device.vendorId,
                productId: device.productId,
                manufacturer: device.manufacturerName || undefined,
                model: device.productName || undefined,
                serialNumber: device.serialNumber || undefined,
            }))
    }

    private async findNodeUSBDevices(criteria: DeviceSearchCriteria): Promise<DeviceDescriptor[]> {
        const usb = await import('usb')
        const devices = usb.usb.getDeviceList()

        const matching: DeviceDescriptor[] = []

        for (const device of devices) {
            const descriptor = device.deviceDescriptor

            // Handle 0 as "any" - if vendorId is 0, don't filter by vendor
            if (
                criteria.vendorId !== undefined &&
                criteria.vendorId !== 0 &&
                descriptor.idVendor !== criteria.vendorId
            ) {
                continue
            }
            // Handle 0 as "any" - if productId is 0, don't filter by product
            if (
                criteria.productId !== undefined &&
                criteria.productId !== 0 &&
                descriptor.idProduct !== criteria.productId
            ) {
                continue
            }

            // Check for PTP interface if class filter is specified
            if (criteria.class === 6) {
                device.open()
                const config = device.configDescriptor
                let hasPTPInterface = false

                if (config) {
                    for (const iface of config.interfaces) {
                        for (const alt of iface) {
                            if (alt.bInterfaceClass === 6 && alt.bInterfaceSubClass === 1) {
                                hasPTPInterface = true
                                break
                            }
                        }
                        if (hasPTPInterface) break
                    }
                }

                if (!hasPTPInterface) {
                    try {
                        device.close()
                    } catch {}
                    continue
                }

                // Since device is already open and we confirmed it's PTP, read the string descriptors
                let manufacturer: string | undefined = undefined
                let model: string | undefined = undefined
                let serialNumber: string | undefined = undefined

                // Use async method to read string descriptors
                {
                    // Define async helper for reading strings
                    const readStringAsync = (index: number): Promise<string | undefined> => {
                        return new Promise(resolve => {
                            device.getStringDescriptor(index, (error: any, value?: string) => {
                                if (error || !value) {
                                    resolve(undefined)
                                } else {
                                    resolve(value)
                                }
                            })
                        })
                    }

                    try {
                        if (descriptor.iManufacturer) {
                            manufacturer = await readStringAsync(descriptor.iManufacturer)
                        }
                        if (descriptor.iProduct) {
                            model = await readStringAsync(descriptor.iProduct)
                        }
                        if (descriptor.iSerialNumber) {
                            serialNumber = await readStringAsync(descriptor.iSerialNumber)
                        }
                    } catch {
                        // Ignore errors, strings will remain undefined
                    }
                }

                try {
                    device.close()
                } catch {}

                matching.push({
                    device,
                    vendorId: descriptor.idVendor,
                    productId: descriptor.idProduct,
                    manufacturer,
                    model,
                    serialNumber,
                })
            } else {
                // Not filtering by class, don't open device
                matching.push({
                    device,
                    vendorId: descriptor.idVendor,
                    productId: descriptor.idProduct,
                    manufacturer: undefined,
                    model: undefined,
                    serialNumber: undefined,
                })
            }
        }

        return matching
    }
}

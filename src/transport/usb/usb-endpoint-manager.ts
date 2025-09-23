import { EndpointManagerInterface, EndpointConfiguration, EndpointType } from '@transport/interfaces/endpoint.interface'

/**
 * USB endpoint manager implementation
 */
export class USBEndpointManager implements EndpointManagerInterface {
    private configuration: EndpointConfiguration | null = null
    private interface: any = null
    private readonly isWebEnvironment = typeof navigator !== 'undefined' && 'usb' in navigator

    /**
     * Configure endpoints for a USB device
     */
    async configureEndpoints(device: any): Promise<EndpointConfiguration> {
        if (this.isWebEnvironment) {
            return this.configureWebUSBEndpoints(device)
        } else {
            return this.configureNodeUSBEndpoints(device)
        }
    }

    /**
     * Release endpoints
     */
    async releaseEndpoints(): Promise<void> {
        if (!this.interface) return

        if (this.isWebEnvironment) {
            // WebUSB handles this during device.releaseInterface
        } else {
            // Node USB - release interface
            try {
                this.interface.release()
            } catch {
                // Ignore errors during release
            }
        }

        this.configuration = null
        this.interface = null
    }

    /**
     * Get current endpoint configuration
     */
    getConfiguration(): EndpointConfiguration | null {
        return this.configuration
    }

    /**
     * Clear endpoint halt condition
     */
    async clearHalt(endpoint: EndpointType): Promise<void> {
        if (!this.configuration) {
            throw new Error('No endpoint configuration')
        }

        if (this.isWebEnvironment) {
            // WebUSB handles this automatically
            return
        }

        // Node USB
        const ep = this.getEndpoint(endpoint)
        if (!ep) {
            throw new Error(`Endpoint ${endpoint} not found`)
        }

        return new Promise((resolve, reject) => {
            ep.clearHalt((error: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }

    private async configureWebUSBEndpoints(device: any): Promise<EndpointConfiguration> {
        // Find PTP interface (class 6, subclass 1, protocol 1)
        const config = device.configuration || device.configurations[0]
        let ptpInterface: any = null

        for (const intf of config.interfaces) {
            const alt = intf.alternates[0]
            if (alt.interfaceClass === 6 && alt.interfaceSubclass === 1) {
                ptpInterface = intf
                break
            }
        }

        if (!ptpInterface) {
            throw new Error('PTP interface not found')
        }

        // Find endpoints
        const endpoints: EndpointConfiguration = {
            bulkIn: null,
            bulkOut: null,
            interrupt: undefined,
        }

        const alt = ptpInterface.alternates[0]
        for (const ep of alt.endpoints) {
            if (ep.direction === 'in' && ep.type === 'bulk') {
                endpoints.bulkIn = ep
            } else if (ep.direction === 'out' && ep.type === 'bulk') {
                endpoints.bulkOut = ep
            } else if (ep.direction === 'in' && ep.type === 'interrupt') {
                endpoints.interrupt = ep
            }
        }

        if (!endpoints.bulkIn || !endpoints.bulkOut) {
            throw new Error('Required bulk endpoints not found')
        }

        this.interface = ptpInterface
        this.configuration = endpoints

        return endpoints
    }

    private async configureNodeUSBEndpoints(device: any): Promise<EndpointConfiguration> {
        const config = device.configDescriptor
        if (!config) {
            throw new Error('No configuration descriptor')
        }

        // Find PTP interface
        let ptpInterface: any = null

        for (let i = 0; i < config.interfaces.length; i++) {
            const iface = config.interfaces[i]
            for (const alt of iface) {
                if (alt.bInterfaceClass === 6 && alt.bInterfaceSubClass === 1) {
                    ptpInterface = device.interface(i)
                    break
                }
            }
            if (ptpInterface) break
        }

        if (!ptpInterface) {
            throw new Error('PTP interface not found')
        }

        // Detach kernel driver if needed
        if (ptpInterface.isKernelDriverActive()) {
            ptpInterface.detachKernelDriver()
        }

        // Claim interface
        ptpInterface.claim()
        console.log(`USB Endpoint Manager: Interface claimed, analyzing endpoints...`)

        // Find endpoints
        const endpoints: EndpointConfiguration = {
            bulkIn: null,
            bulkOut: null,
            interrupt: undefined,
        }

        for (const ep of ptpInterface.endpoints) {
            const desc = ep.descriptor
            console.log(
                `USB Endpoint Manager: Found endpoint 0x${desc.bEndpointAddress.toString(16)}, type: ${desc.bmAttributes & 0x03}`
            )
            if (desc.bEndpointAddress & 0x80 && desc.bmAttributes === 2) {
                endpoints.bulkIn = ep
            } else if (!(desc.bEndpointAddress & 0x80) && desc.bmAttributes === 2) {
                endpoints.bulkOut = ep
            } else if (desc.bEndpointAddress & 0x80 && desc.bmAttributes === 3) {
                endpoints.interrupt = ep
            }
        }

        if (!endpoints.bulkIn || !endpoints.bulkOut) {
            throw new Error('Required bulk endpoints not found')
        }

        this.interface = ptpInterface
        this.configuration = endpoints

        return endpoints
    }

    private getEndpoint(type: EndpointType): any {
        if (!this.configuration) return null

        switch (type) {
            case EndpointType.BULK_IN:
                return this.configuration.bulkIn
            case EndpointType.BULK_OUT:
                return this.configuration.bulkOut
            case EndpointType.INTERRUPT:
                return this.configuration.interrupt
            default:
                return null
        }
    }
}

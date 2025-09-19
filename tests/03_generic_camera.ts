import { describe, it, expect } from 'vitest'
import { PTPProtocol } from '../src/core/ptp/ptp-protocol'
import { PTPMessageBuilder } from '../src/core/ptp/ptp-message-builder'
import { GenericPTPCamera } from '../src/camera/generic/generic-ptp-camera'
import { GenericPropertyMapper } from '../src/camera/generic/generic-property-mapper'
import { TransportFactory } from '../src/transport/transport-factory'
import { TransportInterface } from '../src/transport/interfaces/transport.interface'

describe('GenericPTPCamera', () => {
    let transport: TransportInterface
    let protocol: PTPProtocol
    let camera: GenericPTPCamera

    it('should connect to USB transport', async () => {
        // Create transport using factory
        const transportFactory = new TransportFactory()
        transport = transportFactory.createUSBTransport()

        // Connect to first available PTP device (0,0 means find any PTP device)
        await transport.connect({
            vendorId: 0,
            productId: 0,
        })
        console.log('✅ USB transport connected')

        // Create protocol and message builder
        const messageBuilder = new PTPMessageBuilder()
        protocol = new PTPProtocol(transport, messageBuilder)

        // Create property mapper
        const propertyMapper = new GenericPropertyMapper()

        // Create generic camera
        camera = new GenericPTPCamera(protocol, propertyMapper)

        expect(transport.isConnected()).toBe(true)
    })

    it('should open and close a PTP session', async () => {
        // Test connection (opens PTP session)
        await camera.connect()
        expect(camera.isConnected()).toBe(true)
        console.log('✅ PTP session opened')

        // Test disconnection (closes PTP session)
        await camera.disconnect()
        expect(camera.isConnected()).toBe(false)
        console.log('✅ PTP session closed')
    })

    it('should handle reconnection after disconnection', async () => {
        // Test that we can reconnect after disconnection
        await camera.connect()
        expect(camera.isConnected()).toBe(true)
        console.log('✅ Reconnected successfully')

        // Clean up
        await camera.disconnect()
        await transport.disconnect()
        console.log('✅ Cleaned up')
    })
})

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PTPProtocol } from '../src/core/ptp/ptp-protocol'
import { PTPMessageBuilder } from '../src/core/ptp/ptp-message-builder'
import { SonyCamera } from '../src/camera/vendors/sony/sony-camera'
import { SonyAuthenticator } from '../src/camera/vendors/sony/sony-authenticator'
import { SonyConstants } from '../src/camera/vendors/sony/sony-constants'
import { TransportFactory } from '../src/transport/transport-factory'
import { DeviceProperty } from '../src/camera/properties/device-properties'
import * as fs from 'fs'
import * as path from 'path'

describe('SonyCamera', () => {
    let transport: any
    let protocol: PTPProtocol
    let camera: SonyCamera
    let outputDir: string
    let connected = false

    beforeAll(async () => {
        // Create output directory for captured images
        outputDir = path.join(process.cwd(), 'captured_images')
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
        }
        console.log(`📁 Output directory: ${outputDir}`)

        // Create transport using factory
        const transportFactory = new TransportFactory()
        transport = transportFactory.createUSBTransport()

        // Connect to Sony camera - try both known product IDs
        const productIds = [SonyConstants.PRODUCT_ID, SonyConstants.PRODUCT_ID_ALPHA]

        for (const productId of productIds) {
            try {
                await transport.connect({
                    vendorId: SonyConstants.VENDOR_ID,
                    productId,
                })
                connected = true
                console.log(`✅ Connected to Sony camera (0x${productId.toString(16)})`)
                break
            } catch (error: any) {
                console.log(`Could not connect with product ID 0x${productId.toString(16)}: ${error.message}`)
            }
        }

        if (!connected) {
            throw new Error('No Sony camera found')
        }

        // Create protocol and message builder
        const messageBuilder = new PTPMessageBuilder()
        protocol = new PTPProtocol(transport, messageBuilder)

        // Try to close any existing session first
        try {
            await protocol.closeSession()
            console.log('Closed existing session')
        } catch {
            // Ignore if no session was open
        }

        // Create camera with authenticator
        const authenticator = new SonyAuthenticator()
        camera = new SonyCamera(protocol, authenticator)
    })

    afterAll(async () => {
        if (connected) {
            try {
                await protocol.closeSession()
                console.log('✅ Session closed')
            } catch {
                // Ignore close errors
            }

            await transport.disconnect()
            console.log('✅ Transport disconnected')
        }

        // List captured files
        const capturedFiles = fs
            .readdirSync(outputDir)
            .filter(file => file.endsWith('.jpg') || file.endsWith('.arw') || file.endsWith('.png'))

        if (capturedFiles.length > 0) {
            console.log('\n============================================================')
            console.log('📁 CAPTURED IMAGES SAVED TO:')
            console.log(`   ${outputDir}`)
            capturedFiles.forEach(file => {
                const stats = fs.statSync(path.join(outputDir, file))
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
                const sizeKB = (stats.size / 1024).toFixed(2)
                const sizeDisplay = stats.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
                console.log(`   - ${file} (${sizeDisplay})`)
            })
            console.log('============================================================')
        }
    })

    it('should open session and authenticate', async () => {
        await camera.connect()
        expect(camera.isConnected()).toBe(true)
        console.log('✅ Session opened and authenticated')
    })

    it('should get current ISO', async () => {
        const iso = await camera.getDeviceProperty(DeviceProperty.ISO)
        expect(iso).toBeDefined()
        console.log(`  Current ISO: ${iso}`)
    })

    it('should get current shutter speed', async () => {
        const shutterSpeed = await camera.getDeviceProperty(DeviceProperty.SHUTTER_SPEED)
        expect(shutterSpeed).toBeDefined()
        console.log(`  Current shutter speed: ${shutterSpeed}`)
    })

    it('should get current aperture', async () => {
        const aperture = await camera.getDeviceProperty(DeviceProperty.APERTURE)
        expect(aperture).toBeDefined()
        console.log(`  Current aperture: ${aperture}`)
    })

    it('should get all camera settings together', async () => {
        const settings = await camera.getCameraSettings()
        expect(settings).toBeDefined()
        expect(settings.aperture).toBeDefined()
        expect(settings.shutterSpeed).toBeDefined()
        expect(settings.iso).toBeDefined()
        console.log(`  Camera settings: ${JSON.stringify(settings, null, 2)}`)
    })

    it('should capture a photo', async () => {
        await camera.captureImage()
        console.log('✅ Photo captured')
    })

    it('should download captured photo', async () => {
        const photo = await camera.getPhoto()
        expect(photo).toBeDefined()
        expect(photo.data).toBeInstanceOf(Uint8Array)
        expect(photo.data.length).toBeGreaterThan(0)
        expect(photo.filename).toBeDefined()

        console.log(`  File size: ${photo.data.length} bytes`)

        // Save the photo
        const filePath = path.join(outputDir, photo.filename)
        fs.writeFileSync(filePath, photo.data)

        console.log(`✅ Photo retrieved: ${photo.filename} (${photo.data.length} bytes)`)

        // Detect file type
        const isRAW = photo.data[0] === 0x49 && photo.data[1] === 0x49
        if (isRAW) {
            console.log('📝 Detected RAW format')
        }
        console.log(`💾 PHOTO SAVED TO: ${filePath}`)
    })

    it('should enable live view', async () => {
        await camera.enableLiveView()
        console.log('✅ Live view enabled')
    })

    it('should retrieve live view image', async () => {
        const frame = await camera.getLiveViewFrame()
        expect(frame).toBeDefined()
        expect(frame.data).toBeInstanceOf(Uint8Array)

        if (frame.data.length > 0) {
            console.log(`✅ Live view frame: ${frame.width}x${frame.height} (${frame.data.length} bytes)`)

            const liveViewPath = path.join(outputDir, `liveview_${Date.now()}.jpg`)
            fs.writeFileSync(liveViewPath, frame.data)
            console.log(`💾 LIVE VIEW SAVED TO: ${liveViewPath}`)
        } else {
            console.log('⚠️ Live view frame is empty (camera may not be ready)')
        }
    })

    it('should disable live view', async () => {
        await camera.disableLiveView()
        console.log('✅ Live view disabled')
    })

    it('should enable OSD mode', async () => {
        const result = await camera.setOSDMode(true)
        expect(result).toBe(true)
        console.log('✅ OSD mode enabled')
    })

    it('should retrieve OSD image', async () => {
        try {
            const osdImage = await camera.getOSDImage()
            expect(osdImage).toBeDefined()
            expect(osdImage.data).toBeInstanceOf(Uint8Array)

            const isPNG = osdImage.data[0] === 0x89 && osdImage.data[1] === 0x50
            const fileExtension = isPNG ? '.png' : '.jpg'
            console.log(`✅ OSD image: ${isPNG ? 'PNG' : 'JPEG'} (${osdImage.data.length} bytes)`)

            const osdPath = path.join(outputDir, `osd_${Date.now()}${fileExtension}`)
            fs.writeFileSync(osdPath, osdImage.data)
            console.log(`💾 OSD IMAGE SAVED TO: ${osdPath}`)
        } catch (error: any) {
            // OSD might not be supported on all cameras
            console.log(`⚠️ OSD image retrieval failed: ${error.message}`)
            console.log('   (This is normal if your camera does not support OSD mode)')
        }
    })

    it('should disable OSD mode', async () => {
        const result = await camera.setOSDMode(false)
        expect(result).toBe(true)
        console.log('✅ OSD mode disabled')
    })

    it('should handle multiple operations in sequence', async () => {
        // Quick sequence test
        const iso1 = await camera.getDeviceProperty(DeviceProperty.ISO)
        const iso2 = await camera.getDeviceProperty(DeviceProperty.ISO)
        expect(iso1).toEqual(iso2)

        const settings = await camera.getCameraSettings()
        expect(settings).toBeDefined()

        console.log('✅ Sequential operations completed successfully')
    })
})

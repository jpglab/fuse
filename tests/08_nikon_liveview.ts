import { NikonCamera } from '@camera/nikon-camera'
import { Logger } from '@core/logger'
import { USBTransport } from '@transport/usb/usb-transport'
import * as fs from 'fs'
import * as path from 'path'

const capturedImagesDir = '/Users/kevinschaich/repositories/jpglab/fuse/captured_images'

const logger = new Logger({
    collapseUSB: true,
    collapse: false,
    showDecodedData: true,
    showEncodedData: false,
    expandOnError: true,
    maxLogs: 100,
    minLevel: 'info',
})

const transport = new USBTransport(logger)
const camera = new NikonCamera(transport, logger)

async function main() {
    console.log('Connecting to Nikon camera...')
    await camera.connect()

    console.log('Starting live view...')
    await camera.startLiveView()

    console.log('Capturing single live view frame...')
    const frame = await camera.captureLiveView()

    console.log(`Received frame: ${frame.length} bytes`)

    if (frame.length > 0) {
        // Ensure captured-images directory exists
        if (!fs.existsSync(capturedImagesDir)) {
            fs.mkdirSync(capturedImagesDir, { recursive: true })
        }

        const filename = `nikon_liveview_${Date.now()}.jpg`
        const outputPath = path.join(capturedImagesDir, filename)

        fs.writeFileSync(outputPath, frame)
        console.log(`✓ Saved ${filename}`)
    } else {
        console.log('❌ No image data received')
    }

    console.log('Stopping live view...')
    await camera.stopLiveView()

    console.log('Disconnecting...')
    await camera.disconnect()
}

main().catch(error => {
    console.error('Error:', error)
    process.exit(1)
})

import { Logger } from '@core/logger'
import { USBTransport } from '@transport/usb/usb-transport'
import { operationDefinitions as standardOperationDefinitions } from '@ptp/definitions/operation-definitions'
import { nikonOperationDefinitions } from '@ptp/definitions/vendors/nikon/nikon-operation-definitions'

import { GenericCamera } from 'src'
// import { NikonCamera } from '@camera/nikon-camera'
import { SonyCamera } from '@camera/sony-camera'
import { NikonCamera } from '@camera/nikon-camera'

const mergedOperationDefinitions = [...standardOperationDefinitions, ...nikonOperationDefinitions] as const
const capturedImagesDir = '/Users/kevinschaich/repositories/jpglab/fuse/captured_images'

const logger = new Logger<typeof mergedOperationDefinitions>({
    collapseUSB: false, // Show USB transfer details for debugging
    collapse: false, // Show all details
    showDecodedData: true,
    showEncodedData: true,
    expandOnError: true,
    maxLogs: 1000,
    minLevel: 'debug',
    includeOperations: [],
    excludeOperations: [],
})
const transport = new USBTransport(logger)
const camera = new NikonCamera(transport, logger)

async function main() {
    await camera.connect()

    const deviceInfo = await camera.send('GetDeviceInfo', {})
    const exposureTime = await camera.get('ExposureTime')
    const exposureIndex = await camera.get('ExposureIndex')
    const fNumber = await camera.get('FNumber')

    // Register event handlers to see what events come through
    camera.on('ObjectAdded', event => {
        console.log('📸 ObjectAdded event:', event)
    })

    camera.on('CaptureComplete', event => {
        console.log('✅ CaptureComplete event:', event)
    })

    const capture = await camera.send('InitiateCapture', {})

    // wait 1 second for the events to fire
    await new Promise(resolve => setTimeout(resolve, 1000))

    await camera.disconnect()

    process.exit(0)
}

main()

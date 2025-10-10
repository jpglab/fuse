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

    // Get storage IDs
    const storageIds = await camera.send('GetStorageIDs', {})
    console.log('Storage IDs:', storageIds.data)

    // Get storage info for first storage
    const storageInfo = await camera.send('GetStorageInfo', {
        StorageID: storageIds.data[0],
    })
    console.log('Storage Info:', storageInfo.data)

    // Get all object handles
    const objectIds = await camera.send('GetObjectHandles', {
        StorageID: storageIds.data[0],
    })
    console.log(`Found ${objectIds.data.length} objects`)

    // Get object info for each object
    const objectInfos: { [ObjectHandle: number]: any } = {}

    for await (const objectId of objectIds.data) {
        const objectInfo = await camera.send('GetObjectInfo', {
            ObjectHandle: objectId,
        })
        objectInfos[objectId] = objectInfo.data
    }

    // Filter out association objects (folders)
    const nonAssociationObjectIds = Object.keys(objectInfos)
        .map(Number)
        .filter(id => objectInfos[id].associationType === 0)

    console.log(`Found ${nonAssociationObjectIds.length} files to download`)

    // Import fs and path
    const fs = await import('fs')
    const path = await import('path')

    // Ensure captured-images directory exists
    if (!fs.existsSync(capturedImagesDir)) {
        fs.mkdirSync(capturedImagesDir, { recursive: true })
    }

    // Download all files using Nikon's GetPartialObjectEx (64-bit offset support)
    for (const objectId of nonAssociationObjectIds) {
        const objectSize = objectInfos[objectId].objectCompressedSize
        const filename = objectInfos[objectId].filename
        const outputPath = path.join(capturedImagesDir, filename)

        console.log(`Downloading ${filename} (${objectSize} bytes)...`)

        // Use Nikon's GetPartialObjectEx to retrieve the file in chunks
        const CHUNK_SIZE = 1024 * 1024 * 10 // 10MB chunks (like Sony, thanks to 64-bit offset support)
        const chunks: Uint8Array[] = []
        let offset = 0

        while (offset < objectSize) {
            const bytesToRead = Math.min(CHUNK_SIZE, objectSize - offset)

            // Split offset and size into lower/upper 32-bit values
            const offsetLower = offset & 0xffffffff
            const offsetUpper = Math.floor(offset / 0x100000000)
            const maxSizeLower = bytesToRead & 0xffffffff
            const maxSizeUpper = Math.floor(bytesToRead / 0x100000000)

            const chunkResponse = await camera.send(
                'GetPartialObjectEx',
                {
                    ObjectHandle: objectId,
                    OffsetLower: offsetLower,
                    OffsetUpper: offsetUpper,
                    MaxSizeLower: maxSizeLower,
                    MaxSizeUpper: maxSizeUpper,
                },
                undefined,
                // Add 12 bytes for PTP container header (length + type + code + transactionId)
                offset === 0 ? objectSize + 12 : bytesToRead + 12
            )

            const chunkData = chunkResponse.data as Uint8Array | undefined
            if (!chunkData) {
                throw new Error('No data received from GetPartialObjectEx')
            }

            chunks.push(chunkData)
            offset += chunkData.length
        }

        // Combine all chunks
        const totalBytes = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
        const completeFile = new Uint8Array(totalBytes)
        let writeOffset = 0
        for (const chunk of chunks) {
            completeFile.set(chunk, writeOffset)
            writeOffset += chunk.length
        }

        // Write file
        fs.writeFileSync(outputPath, completeFile)
        console.log(`✓ Saved ${filename}`)
    }

    await camera.disconnect()
}

main()

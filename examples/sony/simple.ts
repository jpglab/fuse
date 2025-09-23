import { Camera } from '@api/camera'
import { SonyOperations } from '@constants/vendors/sony/operations'
import { SonyProperties } from '@constants/vendors/sony/properties'
import { encodePTPValue } from '@core/buffers'
import { DataType } from '@constants/types'

const camera = new Camera()
await camera.connect()

// Set aperture using Sony's vendor-specific operation
console.log('\n=== Setting Aperture with Sony Protocol ===')
const response = await camera.getProtocol().sendOperation({
    ...SonyOperations.SDIO_SET_EXT_DEVICE_PROP_VALUE,
    parameters: [SonyProperties.APERTURE.code],
    data: encodePTPValue(350, DataType.UINT16), // F2.8 = 280
})

console.log('Set aperture response:', response)

// Get the current aperture value
console.log('\n=== Getting Aperture Value ===')
const getResponse = await camera.getProtocol().sendOperation({
    ...SonyOperations.SDIO_GET_EXT_DEVICE_PROP_VALUE,
    parameters: [SonyProperties.APERTURE.code],
})

console.log('Get aperture response:', getResponse)
if (getResponse.data) {
    console.log('Data received (first 20 bytes):', 
        Array.from(getResponse.data.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '))
}

// Capture a photo
console.log('\n=== Capturing Photo ===')
const photo = await camera.captureImage()
console.log('Photo captured:', photo ? 'Success' : 'No data')

await camera.disconnect()

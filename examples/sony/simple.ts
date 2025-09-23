import { Camera } from '@jpglab/fuse/node'

const camera = new Camera()
await camera.connect()

const photo = await camera.captureImage()

console.log('Photo captured')
console.log(photo)

await camera.disconnect()

We have just gone through this migration and I found a problem. We can't export everything to one single index file because it is intended to be used in different runtimes (node vs. web/browser).

The issue I'm getting when I try to import this in a Next.js project is "Can't resolve fs":

- We're using `fs` in `src/client/photo.ts`
- We're using `USBDeviceFinder` in `src/client/discovery.ts` and `src/transport/transport-factory.ts`
- `USBDeviceFinder` imports `usb` which is only available in Node
- We tried making dynamic imports for `USBDeviceFinder` and unfortunately even with the webpack ignores it still bundles the node dependencies for the frontend
- We should split this into two entry points, `node.ts` and `web.ts` instead of the combined `index.ts`
- Only differences in code to be at the highest level (the entry points)
- Maximal code sharing for the rest of the repo
- API should stay the same for client (new Camera(), camera.connect()) without having to pass in transport classes

We want to use Vite library mode and dynamic imports to build this library instead of tsup and webpack.

- I already removed things from package.json.
- Remember we need to have separate web and node entry points.
- Here are the docs:
  https://vite.dev/guide/build.html#library-mode

# Simplified Fuse API Proposal

## Executive Summary

The current API requires 8+ steps and multiple imports to connect to a camera. This proposal introduces a new 'client' layer that reduces connection to 2 lines with zero-configuration auto-discovery while maintaining tree-shakability.

## Current Problems

1. **Too Many Steps**: 8 steps to get a connected camera
2. **Generic Names**: "ApplicationFactory" tells users nothing
3. **Transport Exposure**: Users shouldn't care about USB vs IP initially
4. **Manual Discovery**: Users must manually discover and pass vendor/product IDs
5. **Verbose Imports**: Multiple imports needed for basic usage

## Proposed Solution: Simple, Tree-Shakable API

### Basic Usage (90% of cases)

```typescript
import { Camera } from '@jpglab/fuse'

// Create camera instance with auto-discovery, then connect
const camera = new Camera()
await camera.connect()

// That's it! Camera is ready to use
const photo = await camera.takePhoto()
```

### Advanced Usage (when needed)

```typescript
import { Camera } from '@jpglab/fuse'

// Option 1: Auto-discover specific vendor
const camera = new Camera({ vendor: 'sony' })
await camera.connect()

// Option 2: Auto-discover by model name
const camera = new Camera({ model: '6700' })
await camera.connect()

// Option 3: USB connection with specific device IDs
const camera = new Camera({
    usb: {
        vendorId: 0x054c,
        productId: 0x096f,
    },
})
await camera.connect()

// Option 4: IP connection (future)
const camera = new Camera({
    ip: {
        host: '192.168.1.100',
        port: 15740,
    },
})
await camera.connect()

// Option 5: Stackable filters (AND logic)
const camera = new Camera({
    vendor: 'sony',
    model: 'A7', // Finds Sony cameras with 'A7' in model name
    usb: {
        vendorId: 0x054c, // Must also match this vendor ID
    },
})
await camera.connect()

// Option 6: List available cameras first
import { listCameras } from '@jpglab/fuse'

const cameras = await listCameras()
console.log(cameras)
// [
//   {
//     vendor: 'Sony',
//     model: 'A7III',
//     usb: { vendorId: 0x054c, productId: 0x096f }
//   },
//   {
//     vendor: 'Canon',
//     model: 'R5',
//     usb: { vendorId: 0x04a9, productId: 0x1234 }
//   }
// ]

// Create camera with discovered properties
const camera = new Camera(cameras[0])
await camera.connect()

// Or filter the list
const sonyCameras = await listCameras({ vendor: 'sony' })
const camera = new Camera(sonyCameras[0])
await camera.connect()
```

## API Design

### Tree-Shakable Exports

```typescript
// src/index.ts - Everything is individually exportable
export { Camera } from './camera'
export { listCameras } from './discovery'
export { watchCameras } from './discovery'
export { DeviceProperty } from '@camera/properties/device-properties'
export type { CameraOptions, USBConnection, IPConnection, CameraDescriptor } from './types'
```

### Camera Options (Stackable Filters)

```typescript
// All options are optional and stackable (AND logic)
interface CameraOptions {
    // Auto-discovery filters
    vendor?: string // 'sony', 'canon', etc.
    model?: string // Partial match: '6700', 'A7', 'R5', etc.
    serialNumber?: string // Exact match

    // Transport-specific options
    usb?: {
        vendorId?: number // Can specify just vendorId
        productId?: number // Or both vendorId and productId
    }
    ip?: {
        host: string // Required for IP
        port?: number // Optional, defaults to 15740
        protocol?: 'ptp/ip' | 'upnp' // Future expansion
    }

    // Connection options
    timeout?: number // Connection timeout in ms
}

// Camera descriptor returned by listCameras
interface CameraDescriptor {
    vendor: string
    model: string
    serialNumber?: string

    // Connection info - at least one will be present
    usb?: {
        vendorId: number
        productId: number
    }
    ip?: {
        host: string
        port: number
    }
}
```

### Camera Class

```typescript
import { DeviceProperty } from '@camera/properties/device-properties'

export class Camera {
    // Constructor with optional filters
    constructor(options?: CameraOptions)

    // Connection management
    async connect(): Promise<void>
    async disconnect(): Promise<void>
    isConnected(): boolean

    // Instance properties (available after connect)
    readonly vendor: string
    readonly model: string
    readonly serialNumber: string

    // Basic operations
    async takePhoto(): Promise<Photo>

    // Settings - Simple async getters/setters
    async getISO(): Promise<number>
    async setISO(value: number): Promise<void>
    async getShutterSpeed(): Promise<string> // "1/250", "2"
    async setShutterSpeed(value: string): Promise<void>
    async getAperture(): Promise<string> // "f/2.8", "f/11"
    async setAperture(value: string): Promise<void>
    async getExposureMode(): Promise<'auto' | 'manual' | 'aperture' | 'shutter'>
    async setExposureMode(value: 'auto' | 'manual' | 'aperture' | 'shutter'): Promise<void>

    // Advanced settings using DeviceProperty enum
    async getProperty(property: DeviceProperty): Promise<any>
    async setProperty(property: DeviceProperty, value: any): Promise<void>
    async getProperties(): Promise<Map<DeviceProperty, any>>

    // Live view
    async startLiveView(callback: (frame: Frame) => void): Promise<void>
    async stopLiveView(): Promise<void>

    // Files
    async listPhotos(): Promise<Photo[]>
    async downloadPhoto(photo: Photo): Promise<Buffer>
    async deletePhoto(photo: Photo): Promise<void>

    // Events
    on(event: 'photo', callback: (photo: Photo) => void): void
    on(event: 'error', callback: (error: Error) => void): void
    on(event: 'disconnect', callback: () => void): void
    off(event: string, callback: Function): void
}
```

## Implementation Strategy (Client Layer)

### 1. Smart Auto-Discovery with Stackable Filters

```typescript
// src/client/camera.ts
import { TransportFactory } from '@factories/transport.factory'
import { CameraFactory } from '@factories/camera.factory'
import { CameraInterface } from '@camera/interfaces/camera.interface'
import { TransportType } from '@transport/interfaces/transport.interface'

export class Camera {
    private options: CameraOptions
    private cameraImplementation?: CameraInterface
    private transportFactory: TransportFactory
    private cameraFactory: CameraFactory

    constructor(options?: CameraOptions) {
        this.options = options || {}
        this.transportFactory = new TransportFactory()
        this.cameraFactory = new CameraFactory()
    }

    async connect(): Promise<void> {
        if (!this.options.usb?.productId && !this.options.ip?.host) {
            const cameras = await listCameras(this.options)

            if (cameras.length === 0) {
                const filters = []
                if (this.options.vendor) filters.push(`vendor: ${this.options.vendor}`)
                if (this.options.model) filters.push(`model: ${this.options.model}`)
                if (this.options.usb?.vendorId) filters.push(`USB vendor: 0x${this.options.usb.vendorId.toString(16)}`)

                const filterMsg = filters.length > 0 ? ` matching filters: ${filters.join(', ')}` : ''
                throw new Error(`No cameras found${filterMsg}. Please connect a camera via USB.`)
            }

            this.options = { ...this.options, ...cameras[0] }
        }

        await this.establishConnection()
    }

    private async establishConnection(): Promise<void> {
        if (this.options.ip) {
            throw new Error('IP connections not yet implemented')
        }

        const transport = this.transportFactory.create(TransportType.USB, {
            timeout: this.options.timeout,
        })

        await transport.connect({
            vendorId: this.options.usb?.vendorId || 0,
            productId: this.options.usb?.productId || 0,
            serialNumber: this.options.serialNumber,
        })

        const detectedVendor =
            this.options.vendor ||
            this.cameraFactory.detectVendor(this.options.usb?.vendorId || 0, this.options.usb?.productId || 0)

        this.cameraImplementation = this.cameraFactory.create(detectedVendor, transport)
        await this.cameraImplementation.connect()
    }

    async disconnect(): Promise<void> {
        if (this.cameraImplementation) {
            await this.cameraImplementation.disconnect()
        }
    }

    isConnected(): boolean {
        return this.cameraImplementation?.isConnected() || false
    }
}
```

### 2. Camera Methods Implementation

```typescript
// Continuing src/client/camera.ts
import { DeviceProperty } from '@camera/properties/device-properties'

export class Camera {
    // ... constructor and connection methods above ...

    get vendor(): string {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        return this.cameraImplementation.getInfo().manufacturer
    }

    get model(): string {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        return this.cameraImplementation.getInfo().model
    }

    get serialNumber(): string {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        return this.cameraImplementation.getInfo().serialNumber
    }

    async takePhoto(): Promise<Photo> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        await this.cameraImplementation.captureImage()
        const images = await this.cameraImplementation.listImages()
        const latestImage = images[images.length - 1]
        const imageData = await this.cameraImplementation.downloadImage(latestImage.handle)
        return new Photo(imageData, latestImage)
    }

    async getISO(): Promise<number> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        const value = await this.cameraImplementation.getDeviceProperty(DeviceProperty.ISO)
        return value as number
    }

    async setISO(value: number): Promise<void> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        await this.cameraImplementation.setDeviceProperty(DeviceProperty.ISO, value)
    }

    async getShutterSpeed(): Promise<string> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        const value = await this.cameraImplementation.getDeviceProperty(DeviceProperty.SHUTTER_SPEED)
        return value as string
    }

    async setShutterSpeed(value: string): Promise<void> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        await this.cameraImplementation.setDeviceProperty(DeviceProperty.SHUTTER_SPEED, value)
    }

    async getAperture(): Promise<string> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        const value = await this.cameraImplementation.getDeviceProperty(DeviceProperty.APERTURE)
        return value as string
    }

    async setAperture(value: string): Promise<void> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        await this.cameraImplementation.setDeviceProperty(DeviceProperty.APERTURE, value)
    }

    async getProperty(property: DeviceProperty): Promise<any> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        return this.cameraImplementation.getDeviceProperty(property)
    }

    async setProperty(property: DeviceProperty, value: any): Promise<void> {
        if (!this.cameraImplementation) throw new Error('Camera not connected')
        await this.cameraImplementation.setDeviceProperty(property, value)
    }
}
```

### 3. Tree-Shakable Discovery Functions with Filters

```typescript
// src/client/discovery.ts
import { USBDeviceFinder } from '@transport/usb/usb-device-finder'
import { CameraFactory } from '@factories/camera.factory'
import { CameraOptions, CameraDescriptor } from './types'

export async function listCameras(options?: CameraOptions): Promise<CameraDescriptor[]> {
    const deviceFinder = new USBDeviceFinder()
    const cameraFactory = new CameraFactory()

    const searchCriteria = {
        vendorId: options?.usb?.vendorId || 0,
        productId: options?.usb?.productId || 0,
    }

    const devices = await deviceFinder.findDevices(searchCriteria)

    let cameras = devices.map(device => ({
        vendor: cameraFactory.detectVendor(device.vendorId),
        model: device.productName || 'Unknown',
        serialNumber: device.serialNumber,
        usb: {
            vendorId: device.vendorId,
            productId: device.productId,
        },
    }))

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
    }

    return cameras
}

export function watchCameras(callback: (cameras: CameraDescriptor[]) => void, options?: CameraOptions): () => void {
    const intervalMilliseconds = 1000
    const interval = setInterval(async () => {
        const cameras = await listCameras(options)
        callback(cameras)
    }, intervalMilliseconds)

    return () => clearInterval(interval)
}
```

## Migration Path

### Phase 1: Create New Client Layer

- `src/client/camera.ts` - New simplified Camera class with constructor and connect method
- `src/client/discovery.ts` - Standalone discovery functions
- `src/client/types.ts` - Clean connection option types
- `src/client/photo.ts` - Photo class for image handling
- `src/client/frame.ts` - Frame class for live view

### Phase 2: Update Exports

- Update `src/index.ts` with tree-shakable exports from client layer
- Remove old application layer exports
- Keep factories internal (not exported)

### Phase 3: Package Updates

- Change package name to `@jpglab/fuse`
- Update documentation
- Add a new test `src/tests/06_client.ts` that tests this new API (don't modify existing tests)

## Benefits

1. **Zero Configuration**: Works out of the box with `Camera.connect()`
2. **Tree-Shakable**: Import only what you need
3. **Clear Transport Options**: USB vs IP connections are explicit
4. **Progressive Disclosure**: Simple things are simple, complex things are possible
5. **Better DX**: IDE autocomplete with clear types

## Usage Examples

### Take a Photo

```typescript
import { Camera } from '@jpglab/fuse'

const camera = new Camera()
await camera.connect()
const photo = await camera.takePhoto()
await photo.save('photo.jpg')
```

### Error Handling

```typescript
import { Camera } from '@jpglab/fuse'

try {
    const camera = new Camera({ vendor: 'sony' })
    await camera.connect()
    const photo = await camera.takePhoto()
    await photo.save('photo.jpg')
} catch (error) {
    if (error.message.includes('No cameras found')) {
        console.error('Please connect a Sony camera via USB')
    } else if (error.message.includes('disconnect')) {
        console.error('Camera was disconnected during operation')
    } else {
        console.error('Camera operation failed:', error)
    }
} finally {
    if (camera?.isConnected()) {
        await camera.disconnect()
    }
}
```

### Connect to Specific Vendor

```typescript
import { Camera } from '@jpglab/fuse'

// Auto-discover Sony camera
const camera = new Camera({ vendor: 'sony' })
await camera.connect()
```

### USB Connection with Specific IDs

```typescript
import { Camera } from '@jpglab/fuse'

const camera = new Camera({
    usb: {
        vendorId: 0x054c,
        productId: 0x096f,
    },
})
await camera.connect()
```

### Stackable Filters (AND Logic)

```typescript
import { Camera } from '@jpglab/fuse'

// Find Sony cameras with '6700' in the model name
const camera = new Camera({
    vendor: 'sony',
    model: '6700',
})
await camera.connect()

// More specific: Sony camera at specific vendor ID
const camera = new Camera({
    vendor: 'sony',
    usb: { vendorId: 0x054c },
})
await camera.connect()
```

### IP Connection (Future)

```typescript
import { Camera } from '@jpglab/fuse'

const camera = new Camera({
    ip: {
        host: '192.168.1.100',
        port: 15740,
    },
})
await camera.connect()
```

### List Available Cameras

```typescript
import { Camera, listCameras } from '@jpglab/fuse'

const cameras = await listCameras()
// [
//   {
//     vendor: 'Sony',
//     model: 'A6700',
//     usb: { vendorId: 0x054c, productId: 0x096f }
//   },
//   {
//     vendor: 'Canon',
//     model: 'R5',
//     usb: { vendorId: 0x04a9, productId: 0x1234 }
//   }
// ]

// Connect to first camera
const camera = new Camera(cameras[0])
await camera.connect()

// Or filter the list
const sonyCameras = await listCameras({ vendor: 'sony' })
const camera = new Camera(sonyCameras[0])
await camera.connect()
```

### Live View

```typescript
import { Camera } from '@jpglab/fuse'

const camera = new Camera()
await camera.connect()
await camera.startLiveView(frame => {
    // Display frame in UI
    displayFrame(frame.data)
})
```

### Manual Settings with DeviceProperty

```typescript
import { Camera, DeviceProperty } from '@jpglab/fuse'

const camera = new Camera()
await camera.connect()

// Simple async accessors
await camera.setExposureMode('manual')
await camera.setISO(400)
await camera.setShutterSpeed('1/250')
await camera.setAperture('f/5.6')

// Or use DeviceProperty enum for advanced properties
await camera.setProperty(DeviceProperty.WHITE_BALANCE, 'daylight')
await camera.setProperty(DeviceProperty.FOCUS_MODE, 'auto')

const photo = await camera.takePhoto()
```

### Multiple Cameras

```typescript
import { Camera, listCameras } from '@jpglab/fuse'

const descriptors = await listCameras()
for (const descriptor of descriptors) {
    const camera = new Camera(descriptor)
    await camera.connect()
    console.log(`Connected to ${camera.vendor} ${camera.model}`)
    await camera.disconnect()
}
```

## Summary of Key Changes

### From Old to New

| Old API                          | New API                        |
| -------------------------------- | ------------------------------ |
| `ApplicationFactory`             | `new Camera()` + `connect()`   |
| 8 steps to connect               | 2 lines to connect             |
| Import multiple factories        | Import only `Camera`           |
| Manual vendor detection          | Auto-detects vendor            |
| Ambiguous `vendorId`/`productId` | Explicit `usb: {}` or `ip: {}` |
| No auto-discovery                | Auto-discovers by default      |
| `@jpglab/ptp`                    | `@jpglab/fuse`                 |
| `src/tests/05_camera.ts`         | `src/tests/05_client.ts`       |

### What Stays the Same

- All transport, core, and camera layers remain unchanged
- Existing vendor implementations continue working
- Protocol handling stays identical
- New client layer replaces old application layer
- All the tests from 01 - 04 (below client layer)

### What Gets Removed

- ApplicationFactory
- TransportFactory
- CameraFactory
- Old application layer

## Conclusion

This redesign achieves massive simplification without touching any layers below application:

- **2 lines** instead of 8 steps
- **Clear naming** - `Camera.connect()` is self-explanatory
- **Tree-shakable** - import only what you need
- **Clear transport options** - USB vs IP is explicit via `usb: {}` or `ip: {}`
- **Progressive disclosure** - simple by default, powerful when needed
- **Zero breaking changes** to transport, core, or camera layers

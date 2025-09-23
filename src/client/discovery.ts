/**
 * Discovery functions with runtime detection
 * In Node.js, provides full USB device discovery
 * In browser, returns functions that throw informative errors
 */
import { CameraOptions, CameraDescriptor } from './types'

// Runtime check for Node.js environment
const isNode = typeof window === 'undefined'

export async function listCameras(options?: CameraOptions): Promise<CameraDescriptor[]> {
    if (!isNode) {
        throw new Error('listCameras() is not available in browser environment. Use WebUSB API for camera discovery.')
    }

    // Dynamic import for Node.js environment
    const { listCameras: listCamerasNode } = await import('./discovery-node')
    return listCamerasNode(options)
}

export function watchCameras(callback: (cameras: CameraDescriptor[]) => void, options?: CameraOptions): () => void {
    if (!isNode) {
        throw new Error('watchCameras() is not available in browser environment. Use WebUSB API for camera discovery.')
    }

    const intervalMilliseconds = 1000
    let lastCameraCount = -1

    const checkCameras = async () => {
        try {
            const cameras = await listCameras(options)
            if (cameras.length !== lastCameraCount) {
                lastCameraCount = cameras.length
                callback(cameras)
            }
        } catch (error) {
            console.error('Error watching cameras:', error)
        }
    }

    // Initial check
    checkCameras()

    const interval = setInterval(checkCameras, intervalMilliseconds)

    return () => clearInterval(interval)
}

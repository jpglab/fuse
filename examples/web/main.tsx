import './polyfills'
import './globals.css'
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Camera } from '@api/camera'
import { useEffect, useState } from 'react'
import { CameraInfo } from '@camera/interfaces/camera.interface'
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

const downloadFile = (data: Uint8Array, filename: string, mimeType: string = 'application/octet-stream') => {
    const blob = new Blob([new Uint8Array(data)], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: filename })
    a.click()
    URL.revokeObjectURL(url)
}

const useCamera = () => {
    const [camera, setCamera] = useState<Camera | null>(null)

    useEffect(() => {
        const camera = new Camera()
        setCamera(camera)
    }, [])

    return camera
}

const Button = ({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer disabled:cursor-not-allowed"
            {...props}
        >
            {children}
        </button>
    )
}

export default function App() {
    const camera = useCamera()
    const [connected, setConnected] = useState(false)
    const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null)
    const [streaming, setStreaming] = useState(false)
    const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null)

    useEffect(() => {
        const getCameraInfo = async () => {
            const info = await camera?.getCameraInfo()
            setCameraInfo(info ?? null)
        }
        getCameraInfo()
    }, [camera, connected])

    const onConnect = async () => {
        await camera?.connect()
        setConnected(true)
    }

    const onDisconnect = async () => {
        // Stop streaming and cleanup
        if (streaming) {
            onStopStreaming()
        }
        await camera?.disconnect()
        setConnected(false)
    }

    const onCaptureImage = async () => {
        const result = await camera?.captureImage()
        if (result?.data) {
            const filename = result.info?.filename || 'captured_image.jpg'
            downloadFile(result.data, filename, 'image/jpeg')
        }
    }

    const onCaptureLiveView = async () => {
        const result = await camera?.captureLiveView()
        if (result?.data) {
            const filename = result.info?.filename || 'captured_liveview.jpg'
            downloadFile(result.data, filename, 'image/jpeg')
        }
    }

    useEffect(() => {
        let streamingRef = streaming
        let timeoutId: NodeJS.Timeout | null = null

        const streamFrame = async () => {
            if (!streamingRef || !camera) return

            try {
                const result = await camera.captureLiveView()
                if (result?.data && streamingRef) {
                    // Clean up previous URL
                    if (liveViewUrl) {
                        URL.revokeObjectURL(liveViewUrl)
                    }
                    
                    const blob = new Blob([new Uint8Array(result.data)], { type: 'image/jpeg' })
                    const url = URL.createObjectURL(blob)
                    setLiveViewUrl(url)
                }
            } catch (error) {
                console.error('Error capturing live view:', error)
            }

            // Schedule next frame if still streaming
            if (streamingRef) {
                timeoutId = setTimeout(streamFrame, 34)
            }
        }

        if (streaming && connected) {
            streamFrame()
        }

        return () => {
            streamingRef = false
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            if (liveViewUrl) {
                URL.revokeObjectURL(liveViewUrl)
            }
        }
    }, [streaming, connected, camera, liveViewUrl])

    const onStartStreaming = () => {
        setStreaming(true)
    }

    const onStopStreaming = () => {
        setStreaming(false)
        if (liveViewUrl) {
            URL.revokeObjectURL(liveViewUrl)
            setLiveViewUrl(null)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
                <Button onClick={connected ? onDisconnect : onConnect}>
                    {connected ? 'Disconnect' : 'Connect'}
                </Button>
                {connected && <Button onClick={onCaptureImage}>Capture Image (Download)</Button>}
                {connected && <Button onClick={onCaptureLiveView}>Capture Live View (Download)</Button>}
                {connected && !streaming && <Button onClick={onStartStreaming}>Start Live View Stream</Button>}
                {connected && streaming && <Button onClick={onStopStreaming}>Stop Live View Stream</Button>}
            </div>
            
            <div className="text-center">
                {connected ? `${cameraInfo?.manufacturer} Connected` : 'Disconnected'}
                {streaming && <div className="text-sm text-gray-600 mt-1">Live streaming...</div>}
            </div>

            {liveViewUrl && (
                <div className="flex justify-center">
                    <img 
                        src={liveViewUrl} 
                        alt="Live View" 
                        className="max-w-[80vw] max-h-[60vh] rounded-lg shadow-lg"
                    />
                </div>
            )}
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

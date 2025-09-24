import './polyfills'
import './globals.css'
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Camera } from '@api/camera'
import { useEffect, useState, useRef } from 'react'
import { CameraInfo } from '@camera/interfaces/camera.interface'
import type { ButtonHTMLAttributes } from 'react'

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
    const [fps, setFps] = useState(0)
    const [resolution, setResolution] = useState<{
        source: { width: number; height: number }
        canvas: { width: number; height: number }
    } | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamingRef = useRef(false)
    const animationFrameRef = useRef<number | null>(null)
    const frameTimestamps = useRef<number[]>([])
    const lastFpsUpdate = useRef(0)
    const [settings, setSettings] = useState<{
        aperture: string
        shutterSpeed: string
        iso: string
        liveViewImageQuality: string
    } | null>(null)

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
            stopStreaming()
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

    // High-performance streaming using Canvas and requestAnimationFrame
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        streamingRef.current = streaming

        const streamFrame = async () => {
            if (!streamingRef.current || !camera || !connected) return

            try {
                const exposureSettings = await camera.getDeviceProperty('APERTURE')
                const shutterSpeed = await camera.getDeviceProperty('SHUTTER_SPEED')
                const iso = await camera.getDeviceProperty('ISO')
                const liveViewImageQuality = await camera.getDeviceProperty('LIVE_VIEW_IMAGE_QUALITY')
                setSettings({
                    aperture: exposureSettings,
                    shutterSpeed: shutterSpeed,
                    iso: iso,
                    liveViewImageQuality: liveViewImageQuality,
                })

                const result = await camera.streamLiveView()
                if (result && streamingRef.current) {
                    // Decode JPEG binary data directly to ImageBitmap (no URLs!)
                    const blob = new Blob([new Uint8Array(result)], { type: 'image/jpeg' })
                    const imageBitmap = await createImageBitmap(blob)

                    // Set canvas dimensions to match image
                    canvas.width = imageBitmap.width
                    canvas.height = imageBitmap.height

                    // Update resolution state
                    setResolution({
                        source: { width: imageBitmap.width, height: imageBitmap.height },
                        canvas: { width: canvas.width, height: canvas.height },
                    })

                    // Draw ImageBitmap directly to canvas
                    ctx.drawImage(imageBitmap, 0, 0)

                    // Clean up ImageBitmap resources
                    imageBitmap.close()

                    // Calculate FPS
                    const now = performance.now()
                    frameTimestamps.current.push(now)

                    // Keep only last 30 frame timestamps for rolling average
                    if (frameTimestamps.current.length > 30) {
                        frameTimestamps.current.shift()
                    }

                    // Update FPS display every 500ms
                    if (now - lastFpsUpdate.current > 500) {
                        if (frameTimestamps.current.length >= 2) {
                            const timeSpan =
                                frameTimestamps.current[frameTimestamps.current.length - 1] - frameTimestamps.current[0]
                            const currentFps = Math.round(((frameTimestamps.current.length - 1) * 1000) / timeSpan)
                            setFps(currentFps)
                        }
                        lastFpsUpdate.current = now
                    }

                    // Schedule next frame
                    if (streamingRef.current) {
                        animationFrameRef.current = requestAnimationFrame(streamFrame)
                    }
                }
            } catch (error) {
                console.error('Error capturing live view:', error)
                // Continue streaming even if one frame fails
                if (streamingRef.current) {
                    animationFrameRef.current = requestAnimationFrame(streamFrame)
                }
            }
        }

        if (streaming && connected) {
            streamFrame()
        }

        return () => {
            streamingRef.current = false
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
        }
    }, [streaming, connected, camera])

    const startStreaming = () => {
        setStreaming(true)
    }

    const stopStreaming = () => {
        setStreaming(false)
        streamingRef.current = false
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        // Reset FPS tracking and resolution
        setFps(0)
        setResolution(null)
        frameTimestamps.current = []
        lastFpsUpdate.current = 0
    }

    const onToggleLiveViewImageQuality = async () => {
        stopStreaming()
        await new Promise(resolve => setTimeout(resolve, 100))
        await camera?.setDeviceProperty(
            'LIVE_VIEW_IMAGE_QUALITY',
            settings?.liveViewImageQuality === 'HIGH' ? 'LOW' : 'HIGH'
        )
        await new Promise(resolve => setTimeout(resolve, 100))
        startStreaming()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
                <Button onClick={connected ? onDisconnect : onConnect}>{connected ? 'Disconnect' : 'Connect'}</Button>
                {connected && <Button onClick={onCaptureImage}>Capture Image</Button>}
                {connected && <Button onClick={onCaptureLiveView}>Capture Live View</Button>}
            </div>

            <div className="text-center text-sm text-primary/30">
                {connected ? `${cameraInfo?.manufacturer} Connected` : 'Disconnected'}
            </div>

            {/* Always show live view frame */}
            {connected && (
                <div className="relative flex justify-center">
                    <div className="relative border border-primary/10 rounded-md overflow-hidden bg-primary/5">
                        {streaming ? (
                            <canvas
                                ref={canvasRef}
                                className="max-w-[80vw] max-h-[60vh] block"
                                style={{ display: streaming ? 'block' : 'none' }}
                            />
                        ) : (
                            <div className="flex items-center justify-center max-w-[80vw] max-h-[60vh] w-[640px] h-[480px] text-primary">
                                <span>Live view</span>
                            </div>
                        )}

                        <div className="absolute top-2 left-2 flex flex-row gap-4">
                            {/* FPS meter in top left */}
                            {streaming && fps > 0 && (
                                <div className="px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono">
                                    <span
                                        style={{
                                            color: fps > 24 ? '#4ade8088' : fps > 15 ? '#facc1588' : '#f87171',
                                        }}
                                    >
                                        {fps}
                                    </span>{' '}
                                    FPS
                                </div>
                            )}

                            {/* Resolution display */}
                            {streaming && resolution && (
                                <div className="px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono">
                                    {resolution.source.width}×{resolution.source.height} → {resolution.canvas.width}×
                                    {resolution.canvas.height}
                                </div>
                            )}

                            {/* Live view image quality display */}
                            {streaming && settings && (
                                <div
                                    className="px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono cursor-pointer select-none"
                                    onClick={onToggleLiveViewImageQuality}
                                >
                                    {settings?.liveViewImageQuality === 'HIGH' ? 'HQ' : 'LQ'}
                                </div>
                            )}
                        </div>

                        {/* Exposure settings in top right */}
                        {streaming && settings && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono flex flex-row gap-4">
                                <span>{settings.aperture}</span>
                                <span>{settings.shutterSpeed}</span>
                                <span>{settings.iso}</span>
                            </div>
                        )}

                        {/* Play/Pause button in bottom right */}
                        <button
                            onClick={streaming ? stopStreaming : startStreaming}
                            className="absolute bottom-2 left-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-md flex items-center justify-center text-primary/30 transition-all"
                        >
                            {streaming ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
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

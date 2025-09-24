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

interface ConsoleMessage {
    type: 'log' | 'warn' | 'error' | 'info'
    message: string
    timestamp: number
}

const useConsoleCapture = () => {
    const [messages, setMessages] = useState<ConsoleMessage[]>([])
    
    useEffect(() => {
        // Store original console methods
        const originalLog = console.log
        const originalWarn = console.warn
        const originalError = console.error
        const originalInfo = console.info
        
        const captureMessage = (type: ConsoleMessage['type'], args: any[]) => {
            // Call original console method
            const original = type === 'log' ? originalLog : 
                           type === 'warn' ? originalWarn :
                           type === 'error' ? originalError : originalInfo
            original.apply(console, args)
            
            // Capture and format message
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2)
                    } catch {
                        return String(arg)
                    }
                }
                return String(arg)
            }).join(' ')
            
            // Filter out repetitive USB Transport messages to reduce console spam
            if (message.includes('USB Transport:') || message.includes('Sending') || message.includes('Receiving')) {
                return // Skip logging these messages
            }
            
            setMessages(prev => {
                // If we're at 10 messages, remove the oldest one before adding new
                const newMessages = prev.length >= 10 ? prev.slice(1) : prev
                return [...newMessages, { type, message, timestamp: Date.now() }]
            })
        }
        
        // Override console methods
        console.log = (...args) => captureMessage('log', args)
        console.warn = (...args) => captureMessage('warn', args)
        console.error = (...args) => captureMessage('error', args)
        console.info = (...args) => captureMessage('info', args)
        
        // Restore on unmount
        return () => {
            console.log = originalLog
            console.warn = originalWarn
            console.error = originalError
            console.info = originalInfo
        }
    }, [])
    
    return messages
}

const useCamera = () => {
    const [camera, setCamera] = useState<Camera | null>(null)
    const cameraRef = useRef<Camera | null>(null)

    useEffect(() => {
        const camera = new Camera()
        setCamera(camera)
        cameraRef.current = camera

        // Handle page refresh/navigation
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (cameraRef.current?.isConnected()) {
                // Try to disconnect synchronously
                cameraRef.current.disconnect().catch(err => {
                    console.error('Error disconnecting camera during beforeunload:', err)
                })
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)

            if (camera.isConnected()) {
                camera.disconnect().catch(err => {
                    console.error('Error disconnecting camera during cleanup:', err)
                })
            }
        }
    }, [])

    return camera
}

const Button = ({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            className={
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer disabled:cursor-not-allowed" +
                ' ' +
                className
            }
            {...props}
        >
            {children}
        </button>
    )
}

export default function App() {
    const camera = useCamera()
    const consoleMessages = useConsoleCapture()
    const [connected, setConnected] = useState(false)
    const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null)
    const [streaming, setStreaming] = useState(false)
    const [streamOSD, setStreamOSD] = useState(false)
    const [fps, setFps] = useState(0)
    const [resolution, setResolution] = useState<{
        source: { width: number; height: number }
    } | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamingRef = useRef(false)
    const streamOSDRef = useRef(false)
    const animationFrameRef = useRef<number | null>(null)
    const frameTimestamps = useRef<number[]>([])
    const lastFpsUpdate = useRef(0)
    const lastOSDImage = useRef<ImageBitmap | null>(null)
    const lastOSDFetch = useRef(0)
    const osdFailureCount = useRef(0)
    const OSD_FETCH_INTERVAL = 5000 // Fetch OSD every 5 seconds to be extra safe
    const MAX_OSD_FAILURES = 3 // Disable OSD after 3 consecutive failures
    const [settings, setSettings] = useState<{
        aperture: string
        shutterSpeed: string
        iso: string
        liveViewImageQuality: string
    } | null>(null)
    const [changedProps, setChangedProps] = useState<Set<string>>(new Set())
    const previousSettings = useRef<typeof settings>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    // Auto-scroll terminal to bottom when new messages arrive
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [consoleMessages])

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
        stopStreaming()
        await new Promise(resolve => setTimeout(resolve, 100))
        const result = await camera?.captureImage()
        if (result?.data) {
            const filename = result.info?.filename || 'captured_image.jpg'
            downloadFile(result.data, filename, 'image/jpeg')
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        startStreaming()
    }

    const onCaptureLiveView = async () => {
        stopStreaming()
        await new Promise(resolve => setTimeout(resolve, 100))
        const result = await camera?.captureLiveView()
        if (result?.data) {
            const filename = result.info?.filename || 'captured_liveview.jpg'
            downloadFile(result.data, filename, 'image/jpeg')
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        startStreaming()
    }

    // High-performance streaming using Canvas and requestAnimationFrame
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        streamingRef.current = streaming
        streamOSDRef.current = streamOSD

        const streamFrame = async () => {
            if (!streamingRef.current || !camera || !connected) return

            try {
                const exposureSettings = await camera.getDeviceProperty('APERTURE')
                const shutterSpeed = await camera.getDeviceProperty('SHUTTER_SPEED')
                const iso = await camera.getDeviceProperty('ISO')
                const liveViewImageQuality = await camera.getDeviceProperty('LIVE_VIEW_IMAGE_QUALITY')

                const newSettings = {
                    aperture: exposureSettings,
                    shutterSpeed: shutterSpeed,
                    iso: iso,
                    liveViewImageQuality: liveViewImageQuality,
                }

                // Track which properties changed
                if (previousSettings.current) {
                    const changed = new Set<string>()
                    if (previousSettings.current.aperture !== newSettings.aperture) changed.add('aperture')
                    if (previousSettings.current.shutterSpeed !== newSettings.shutterSpeed) changed.add('shutterSpeed')
                    if (previousSettings.current.iso !== newSettings.iso) changed.add('iso')
                    if (previousSettings.current.liveViewImageQuality !== newSettings.liveViewImageQuality)
                        changed.add('liveViewImageQuality')

                    if (changed.size > 0) {
                        setChangedProps(changed)
                        // Clear highlights after animation
                        setTimeout(() => setChangedProps(new Set()), 1000)
                    }
                }

                previousSettings.current = newSettings
                setSettings(newSettings)

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
                    })

                    // Draw live view image to canvas
                    ctx.drawImage(imageBitmap, 0, 0)

                    // Clean up live view ImageBitmap resources
                    imageBitmap.close()

                    // If OSD is enabled and not permanently failed, overlay it on top
                    if (streamOSDRef.current && osdFailureCount.current < MAX_OSD_FAILURES) {
                        const currentTime = performance.now()
                        
                        // Fetch new OSD image only if enough time has passed
                        if (currentTime - lastOSDFetch.current > OSD_FETCH_INTERVAL) {
                            try {
                                const osdResult = await camera.streamOSD()
                                if (osdResult && osdResult.length > 0) {
                                    // Success - reset failure count
                                    osdFailureCount.current = 0
                                    
                                    // Clean up previous OSD image
                                    if (lastOSDImage.current) {
                                        lastOSDImage.current.close()
                                    }
                                    
                                    // Decode PNG binary data directly to ImageBitmap
                                    const osdBlob = new Blob([new Uint8Array(osdResult)], { type: 'image/png' })
                                    const osdBitmap = await createImageBitmap(osdBlob)
                                    
                                    // Cache the OSD image
                                    lastOSDImage.current = osdBitmap
                                    lastOSDFetch.current = currentTime
                                } else {
                                    // OSD returned empty (disabled in camera implementation)
                                    osdFailureCount.current++
                                    lastOSDFetch.current = currentTime
                                }
                            } catch (osdError) {
                                console.error('Error fetching OSD:', osdError)
                                osdFailureCount.current++
                                lastOSDFetch.current = currentTime // Update to avoid rapid retries
                                
                                if (osdFailureCount.current >= MAX_OSD_FAILURES) {
                                    console.error(`OSD disabled after ${MAX_OSD_FAILURES} failures`)
                                    setStreamOSD(false) // Turn off OSD toggle
                                }
                            }
                        }
                        
                        // Draw cached OSD image if available
                        if (lastOSDImage.current) {
                            try {
                                // Draw OSD on top, scaled to full canvas width
                                ctx.drawImage(lastOSDImage.current, 0, 0, canvas.width, canvas.height)
                            } catch (drawError) {
                                console.error('Error drawing OSD:', drawError)
                                // Clear invalid cached image
                                lastOSDImage.current = null
                            }
                        }
                    } else {
                        // Clean up OSD image when disabled
                        if (lastOSDImage.current) {
                            lastOSDImage.current.close()
                            lastOSDImage.current = null
                        }
                    }

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
            // Clean up cached OSD image
            if (lastOSDImage.current) {
                lastOSDImage.current.close()
                lastOSDImage.current = null
            }
        }
    }, [streaming, streamOSD, connected, camera])

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
            </div>

            {/* Live view frame */}
            <div className="relative flex justify-center">
                <div className="relative border border-primary/10 rounded-md overflow-hidden bg-primary/5">
                    {streaming ? (
                        <canvas
                            ref={canvasRef}
                            className="max-w-[80vw] max-h-[60vh] block"
                            style={{ display: streaming ? 'block' : 'none' }}
                        />
                    ) : (
                        <div className="flex items-center justify-center max-w-[80vw] max-h-[60vh] w-[640px] h-[480px] text-center text-sm text-primary/30">
                            <span>{connected ? `${cameraInfo?.manufacturer} Connected` : 'Disconnected'}</span>
                        </div>
                    )}

                    <div className="absolute top-2 left-2 flex flex-row gap-4">
                        {/* FPS meter in top left */}
                        <div className="px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono">
                            <span
                                style={{
                                    color: fps > 24 ? '#4ade8088' : fps > 15 ? '#facc1588' : '#f87171',
                                }}
                            >
                                {fps || 0}
                            </span>{' '}
                            FPS
                        </div>

                        {/* Resolution display */}
                        <div className="px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono">
                            {resolution?.source.width || '--'} × {resolution?.source.height || '--'}
                        </div>

                        {/* Live view image quality display */}
                        <div
                            className="px-2 py-1 bg-black/70 rounded text-xs font-mono cursor-pointer select-none transition-colors duration-300"
                            style={{ color: changedProps.has('liveViewImageQuality') ? '#4ade80' : '#ffffff4c' }}
                            onClick={onToggleLiveViewImageQuality}
                        >
                            {settings?.liveViewImageQuality
                                ? settings.liveViewImageQuality === 'HIGH'
                                    ? 'HQ'
                                    : 'LQ'
                                : '--'}
                        </div>
                        
                        {/* OSD indicator */}
                        {streamOSD && (
                            <div className="px-2 py-1 bg-black/70 rounded text-xs font-mono text-yellow-400/80">
                                OSD
                            </div>
                        )}
                    </div>

                    {/* Exposure settings in top right */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-primary/30 text-xs font-mono flex flex-row gap-4">
                        <span
                            className="transition-colors duration-300"
                            style={{ color: changedProps.has('aperture') ? '#4ade80' : undefined }}
                        >
                            {settings?.aperture || '--'}
                        </span>
                        <span
                            className="transition-colors duration-300"
                            style={{ color: changedProps.has('shutterSpeed') ? '#4ade80' : undefined }}
                        >
                            {settings?.shutterSpeed || '--'}
                        </span>
                        <span
                            className="transition-colors duration-300"
                            style={{ color: changedProps.has('iso') ? '#4ade80' : undefined }}
                        >
                            {settings?.iso || '--'}
                        </span>
                    </div>

                    {/* Play/Pause button in bottom right */}
                    <div className="absolute bottom-2 left-2">
                        <Button
                            onClick={streaming ? stopStreaming : startStreaming}
                            disabled={!connected}
                            className="w-8! h-8! bg-black/50! hover:bg-black/70! rounded-md flex items-center justify-center text-primary/30 transition-all"
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
                        </Button>
                    </div>

                    <div className="absolute bottom-2 right-2 flex flex-row gap-2">
                        {/* OSD Toggle button */}
                        <button
                            onClick={() => {
                                setStreamOSD(!streamOSD)
                                // Reset failure count when enabling OSD
                                if (!streamOSD) {
                                    osdFailureCount.current = 0
                                }
                            }}
                            className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-md flex items-center justify-center text-primary/30 transition-all"
                            disabled={!connected || !streaming}
                            title={streamOSD ? "Hide OSD overlay" : "Show OSD overlay"}
                        >
                            <svg 
                                className="w-4 h-4" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {streamOSD ? (
                                    // Layers icon when OSD is on
                                    <path d="M12 16L19.36 10.27L21 9L12 2L3 9L4.63 10.27M12 18.54L4.62 12.81L3 14.07L12 21.07L21 14.07L19.37 12.8L12 18.54Z" />
                                ) : (
                                    // Single layer icon when OSD is off
                                    <path d="M12 2L3 9L12 16L21 9L12 2M12 4.53L18.74 9L12 13.47L5.26 9L12 4.53Z" />
                                )}
                            </svg>
                        </button>

                        <Button
                            onClick={onCaptureImage}
                            disabled={!connected}
                            className="w-8! h-8! bg-black/50! hover:bg-black/70! rounded-md flex items-center justify-center text-primary/30 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                            >
                                <path d="M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,65.78a88.18,88.18,0,0,1,11,13.48L167.55,119,139.63,40.78A87.34,87.34,0,0,1,190.23,65.78ZM155.59,133l-18.16,21.37-27.59-5L100.41,123l18.16-21.37,27.59,5ZM65.77,65.78a87.34,87.34,0,0,1,56.66-25.59l17.51,49L58.3,74.32A88,88,0,0,1,65.77,65.78ZM46.65,161.54a88.41,88.41,0,0,1,2.53-72.62l51.21,9.35Zm19.12,28.68a88.18,88.18,0,0,1-11-13.48L88.45,137l27.92,78.18A87.34,87.34,0,0,1,65.77,190.22Zm124.46,0a87.34,87.34,0,0,1-56.66,25.59l-17.51-49,81.64,14.91A88,88,0,0,1,190.23,190.22Zm-34.62-32.49,53.74-63.27a88.41,88.41,0,0,1-2.53,72.62Z"></path>
                            </svg>
                        </Button>

                        <Button
                            onClick={onCaptureLiveView}
                            disabled={!connected}
                            className="w-8! h-8! bg-black/50! hover:bg-black/70! rounded-md flex items-center justify-center text-primary/30 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                            >
                                <path d="M216,48V88a8,8,0,0,1-16,0V56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM88,200H56V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16Zm120-40a8,8,0,0,0-8,8v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,208,160ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,16,0V56H88a8,8,0,0,0,0-16Z"></path>
                            </svg>
                        </Button>

                        <Button
                            // onClick={onRecord}
                            disabled={true}
                            className="w-8! h-8! bg-black/50! hover:bg-black/70! rounded-md flex items-center justify-center text-primary/30 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="var(--color-red-400)"
                                viewBox="0 0 256 256"
                            >
                                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm72-88a72,72,0,1,1-72-72A72.08,72.08,0,0,1,200,128Z"></path>
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Terminal-like console output */}
            <div className="w-full max-w-[80vw] border border-primary/10 rounded-md bg-black/90 p-2">
                <div 
                    ref={terminalRef}
                    className="h-48 overflow-y-auto font-mono text-xs text-green-400/80"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {consoleMessages.map((msg, index) => (
                        <div 
                            key={`${msg.timestamp}-${index}`}
                            className="whitespace-pre-wrap break-words mb-1"
                            style={{
                                color: msg.type === 'error' ? '#ef4444' :
                                       msg.type === 'warn' ? '#f59e0b' :
                                       msg.type === 'info' ? '#3b82f6' : '#4ade80cc'
                            }}
                        >
                            <span className="opacity-50">[{new Date(msg.timestamp).toLocaleTimeString()}]</span> {msg.message}
                        </div>
                    ))}
                    {consoleMessages.length === 0 && (
                        <div className="text-primary/30">Console output will appear here...</div>
                    )}
                </div>
            </div>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

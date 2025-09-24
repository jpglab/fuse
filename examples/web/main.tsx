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

interface CapturedFrame {
    imageBitmap: ImageBitmap
    timestamp: number
    settings: {
        aperture: string
        shutterSpeed: string
        iso: string
        liveViewImageQuality: string
    }
}

interface AudioSample {
    timestamp: number
    audioBuffer: AudioBuffer
}

const useConsoleCapture = (enabled: boolean) => {
    const [messages, setMessages] = useState<ConsoleMessage[]>([])

    useEffect(() => {
        if (!enabled) {
            setMessages([])
            return
        }

        // Store original console methods
        const originalLog = console.log
        const originalWarn = console.warn
        const originalError = console.error
        const originalInfo = console.info

        const captureMessage = (type: ConsoleMessage['type'], args: any[]) => {
            // Call original console method
            const original =
                type === 'log'
                    ? originalLog
                    : type === 'warn'
                      ? originalWarn
                      : type === 'error'
                        ? originalError
                        : originalInfo
            original.apply(console, args)

            // Capture and format message
            const message = args
                .map(arg => {
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg, null, 2)
                        } catch {
                            return String(arg)
                        }
                    }
                    return String(arg)
                })
                .join(' ')

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
    }, [enabled])

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
    const [showConsole, setShowConsole] = useState(false)
    const consoleMessages = useConsoleCapture(showConsole)
    const [connected, setConnected] = useState(false)
    const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null)
    const [streaming, setStreaming] = useState(false)
    const [fps, setFps] = useState(0)
    const [resolution, setResolution] = useState<{
        source: { width: number; height: number }
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
    const [changedProps, setChangedProps] = useState<Set<string>>(new Set())
    const previousSettings = useRef<typeof settings>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    // Timeline and recording state
    const [isRecording, setIsRecording] = useState(false)
    const [capturedFrames, setCapturedFrames] = useState<CapturedFrame[]>([])
    const [capturedAudio, setCapturedAudio] = useState<AudioSample[]>([])
    const [isPlayingback, setIsPlayingback] = useState(false)
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const [timelineZoom, setTimelineZoom] = useState(1) // Zoom level for timeline
    const [clipTrimStart, setClipTrimStart] = useState(0) // Start frame for trimmed clip
    const [clipTrimEnd, setClipTrimEnd] = useState(0) // End frame for trimmed clip

    // Audio recording state
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('')
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null)
    const [realtimeAudioData, setRealtimeAudioData] = useState<Float32Array[]>([]) // Store audio chunks during recording
    const playbackAnimationFrameRef = useRef<number | null>(null)
    const playbackFrameIndexRef = useRef(0)
    const lastPlaybackTime = useRef(0)
    const isRecordingRef = useRef(false)
    const realtimeAudioCaptureRef = useRef<number | null>(null)
    const audioProcessorRef = useRef<ScriptProcessorNode | null>(null)
    const maxFrames = 300 // Limit to ~10 seconds at 30fps

    // Initialize audio context and get audio devices
    useEffect(() => {
        const initAudio = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                const audioInputs = devices.filter(device => device.kind === 'audioinput')
                setAudioDevices(audioInputs)

                if (audioInputs.length > 0) {
                    setSelectedAudioDevice(audioInputs[0].deviceId)
                }

                const context = new AudioContext()
                setAudioContext(context)
            } catch (error) {
                console.error('Error initializing audio:', error)
            }
        }

        initAudio()
    }, [])

    // Auto-scroll terminal to bottom when new messages arrive
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [consoleMessages])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clean up all captured frames
            capturedFrames.forEach(frame => frame.imageBitmap.close())

            // Clean up audio context
            if (audioContext) {
                audioContext.close()
            }

            // Stop media recorder
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop()
            }

            // Cancel any running animation frames
            if (playbackAnimationFrameRef.current) {
                cancelAnimationFrame(playbackAnimationFrameRef.current)
            }
            if (realtimeAudioCaptureRef.current) {
                cancelAnimationFrame(realtimeAudioCaptureRef.current)
            }
            if (audioProcessorRef.current) {
                audioProcessorRef.current.disconnect()
            }
        }
    }, [])

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

                    // Draw ImageBitmap directly to canvas
                    ctx.drawImage(imageBitmap, 0, 0)

                    // Capture frame for timeline if recording
                    if (isRecording) {
                        const frameToStore = await createImageBitmap(blob)

                        setCapturedFrames(prevFrames => {
                            const newFrame: CapturedFrame = {
                                imageBitmap: frameToStore,
                                timestamp: performance.now(),
                                settings: { ...newSettings },
                            }

                            // Circular buffer to prevent memory overflow
                            const updatedFrames = [...prevFrames, newFrame]
                            if (updatedFrames.length > maxFrames) {
                                // Clean up old frame resources
                                updatedFrames[0].imageBitmap.close()
                                return updatedFrames.slice(1)
                            }

                            // Update trim end when frames change
                            setClipTrimEnd(updatedFrames.length - 1)

                            return updatedFrames
                        })
                    }

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

    // Timeline and playback functions
    const onToggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false)
            isRecordingRef.current = false

            // Cancel real-time audio capture
            if (realtimeAudioCaptureRef.current) {
                cancelAnimationFrame(realtimeAudioCaptureRef.current)
                realtimeAudioCaptureRef.current = null
            }

            // Disconnect audio processor
            if (audioProcessorRef.current) {
                audioProcessorRef.current.disconnect()
                audioProcessorRef.current = null
            }

            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop()
            }
            // Clear real-time audio data
            setRealtimeAudioData([])
            console.log(
                `Recording stopped. Captured ${capturedFrames.length} frames and ${capturedAudio.length} audio samples.`
            )
        } else {
            // Start recording
            setIsRecording(true)
            isRecordingRef.current = true

            // Start audio recording if available
            if (selectedAudioDevice && audioContext) {
                try {
                    // Ensure audio context is running
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume()
                    }

                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: selectedAudioDevice },
                    })

                    // Clear previous real-time data
                    setRealtimeAudioData([])

                    // Set up AudioWorklet for real-time audio processing
                    const processorNode = audioContext.createScriptProcessor(4096, 1, 1)
                    const gainNode = audioContext.createGain()
                    gainNode.gain.value = 0 // Mute to avoid feedback

                    const source = audioContext.createMediaStreamSource(stream)
                    source.connect(processorNode)
                    processorNode.connect(gainNode)
                    gainNode.connect(audioContext.destination)

                    audioProcessorRef.current = processorNode

                    processorNode.onaudioprocess = event => {
                        if (isRecordingRef.current) {
                            const inputData = event.inputBuffer.getChannelData(0)
                            const audioChunk = new Float32Array(inputData)

                            setRealtimeAudioData(prev => {
                                const newData = [...prev, audioChunk]
                                // Limit buffer size to prevent memory overflow
                                return newData.length > maxFrames ? newData.slice(-maxFrames) : newData
                            })
                        }
                    }

                    const recorder = new MediaRecorder(stream)
                    const audioChunks: Blob[] = []

                    recorder.ondataavailable = event => {
                        if (event.data.size > 0) {
                            audioChunks.push(event.data)
                        }
                    }

                    recorder.onstop = async () => {
                        try {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                            const arrayBuffer = await audioBlob.arrayBuffer()
                            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

                            setCapturedAudio(prev => [
                                ...prev,
                                {
                                    timestamp: performance.now(),
                                    audioBuffer,
                                },
                            ])

                            console.log('Audio captured:', audioBuffer.duration, 'seconds')
                        } catch (error) {
                            console.error('Error processing audio:', error)
                        }

                        // Clean up stream and real-time data
                        stream.getTracks().forEach(track => track.stop())
                        source.disconnect()
                    }

                    setMediaRecorder(recorder)
                    recorder.start(100) // Collect data every 100ms
                    console.log('Audio recording started with real-time analysis')
                } catch (error) {
                    console.error('Error starting audio recording:', error)
                }
            }
        }
    }

    const onTogglePlayback = () => {
        if (capturedFrames.length === 0) {
            console.log('No frames to playback')
            return
        }

        if (isPlayingback) {
            console.log('Stopping playback')
            setIsPlayingback(false)
            if (playbackAnimationFrameRef.current) {
                cancelAnimationFrame(playbackAnimationFrameRef.current)
                playbackAnimationFrameRef.current = null
            }

            // Stop audio playback
            if (audioSource) {
                try {
                    audioSource.stop()
                    setAudioSource(null)
                    console.log('Audio playback stopped')
                } catch (error) {
                    console.error('Error stopping audio playback:', error)
                }
            }
        } else {
            console.log(`Starting playback with ${capturedFrames.length} frames`)
            stopStreaming()
            setIsPlayingback(true)
            setCurrentFrameIndex(clipTrimStart)
            playbackFrameIndexRef.current = clipTrimStart
            lastPlaybackTime.current = performance.now()

            // Start audio playback if available
            if (capturedAudio.length > 0 && audioContext && capturedFrames.length > 0) {
                try {
                    const audioBuffer = capturedAudio[0].audioBuffer
                    const source = audioContext.createBufferSource()
                    source.buffer = audioBuffer
                    source.connect(audioContext.destination)

                    // Calculate timing based on actual frame timestamps
                    const firstFrameTime = capturedFrames[0].timestamp
                    const lastFrameTime = capturedFrames[capturedFrames.length - 1].timestamp
                    const totalVideoTime = (lastFrameTime - firstFrameTime) / 1000 // Convert to seconds

                    // Calculate trim times based on proportional position in the recording
                    const trimStartRatio = clipTrimStart / (capturedFrames.length - 1)
                    const trimEndRatio = clipTrimEnd / (capturedFrames.length - 1)

                    const trimStartTime = trimStartRatio * audioBuffer.duration
                    const trimEndTime = trimEndRatio * audioBuffer.duration
                    const trimDuration = trimEndTime - trimStartTime

                    source.start(0, trimStartTime, trimDuration)
                    setAudioSource(source)
                    console.log('Audio playback started:', {
                        totalVideoTime,
                        audioBufferDuration: audioBuffer.duration,
                        trimStartTime,
                        trimDuration,
                    })
                } catch (error) {
                    console.error('Error starting audio playback:', error)
                }
            }
        }
    }

    // Playback effect
    useEffect(() => {
        if (!isPlayingback || capturedFrames.length === 0) {
            if (playbackAnimationFrameRef.current) {
                cancelAnimationFrame(playbackAnimationFrameRef.current)
                playbackAnimationFrameRef.current = null
            }
            return
        }

        console.log('Starting playback effect')

        const playbackFrame = () => {
            if (!isPlayingback) {
                console.log('Playback stopped, exiting animation loop')
                return
            }

            if (capturedFrames.length === 0) {
                console.log('No frames available')
                return
            }

            const canvas = canvasRef.current
            const ctx = canvas?.getContext('2d')
            if (!canvas || !ctx) {
                console.log('Canvas not available')
                return
            }

            const now = performance.now()
            const deltaTime = now - lastPlaybackTime.current

            // Control playback speed (assuming 30fps base rate)
            const targetFrameTime = 1000 / 30 / playbackSpeed

            if (deltaTime >= targetFrameTime) {
                const frameIndex = playbackFrameIndexRef.current
                const frame = capturedFrames[frameIndex]

                if (frame) {
                    console.log(`Playing frame ${frameIndex + 1}/${capturedFrames.length}`)
                    canvas.width = frame.imageBitmap.width
                    canvas.height = frame.imageBitmap.height
                    ctx.drawImage(frame.imageBitmap, 0, 0)

                    // Update settings display during playback
                    setSettings(frame.settings)

                    // Update UI state
                    setCurrentFrameIndex(frameIndex)
                }

                // Advance frame index within trim bounds
                const nextFrame = playbackFrameIndexRef.current + 1
                if (nextFrame > clipTrimEnd) {
                    // Loop back to start of trimmed section
                    playbackFrameIndexRef.current = clipTrimStart
                } else {
                    playbackFrameIndexRef.current = nextFrame
                }
                lastPlaybackTime.current = now
            }

            playbackAnimationFrameRef.current = requestAnimationFrame(playbackFrame)
        }

        playbackFrame()

        return () => {
            console.log('Cleaning up playback effect')
            if (playbackAnimationFrameRef.current) {
                cancelAnimationFrame(playbackAnimationFrameRef.current)
                playbackAnimationFrameRef.current = null
            }

            // Clean up audio source
            if (audioSource) {
                try {
                    audioSource.stop()
                    setAudioSource(null)
                } catch (error) {
                    // Audio source might already be stopped
                }
            }
        }
    }, [isPlayingback, capturedFrames.length, playbackSpeed])

    const onScrubTimeline = (frameIndex: number) => {
        if (capturedFrames.length === 0) return

        // Clamp to trim bounds
        const clampedIndex = Math.max(clipTrimStart, Math.min(frameIndex, clipTrimEnd))
        setCurrentFrameIndex(clampedIndex)
        playbackFrameIndexRef.current = clampedIndex

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        const frame = capturedFrames[clampedIndex]
        if (frame) {
            canvas.width = frame.imageBitmap.width
            canvas.height = frame.imageBitmap.height
            ctx.drawImage(frame.imageBitmap, 0, 0)
            setSettings(frame.settings)
            console.log(`Scrubbed to frame ${clampedIndex + 1}/${capturedFrames.length}`)
        }
    }

    const onClearTimeline = () => {
        // Clean up ImageBitmap resources
        capturedFrames.forEach(frame => frame.imageBitmap.close())
        setCapturedFrames([])
        setCapturedAudio([])
        setRealtimeAudioData([])
        setCurrentFrameIndex(0)
        setIsPlayingback(false)
        setIsRecording(false)
        isRecordingRef.current = false

        // Cancel any running animation frames
        if (realtimeAudioCaptureRef.current) {
            cancelAnimationFrame(realtimeAudioCaptureRef.current)
            realtimeAudioCaptureRef.current = null
        }

        // Disconnect audio processor
        if (audioProcessorRef.current) {
            audioProcessorRef.current.disconnect()
            audioProcessorRef.current = null
        }

        setClipTrimStart(0)
        setClipTrimEnd(0)

        // Stop any active recording
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()
        }

        // Stop any audio playback
        if (audioSource) {
            try {
                audioSource.stop()
                setAudioSource(null)
            } catch (error) {
                // Audio source might already be stopped
            }
        }

        if (playbackAnimationFrameRef.current) {
            cancelAnimationFrame(playbackAnimationFrameRef.current)
            playbackAnimationFrameRef.current = null
        }
    }

    // Convert frame to timecode format (hh:mm:ss:ff)
    const formatTimecode = (frameIndex: number, fps: number = 30) => {
        const totalSeconds = frameIndex / fps
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = Math.floor(totalSeconds % 60)
        const frames = frameIndex % fps

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
    }

    // Playhead dragging functionality
    const onPlayheadMouseDown = (e: React.MouseEvent) => {
        if (capturedFrames.length === 0) return

        // Get the initial timeline container reference
        const initialTimelineContainer = (e.target as HTMLElement).closest('.timeline-track-container')
        if (!initialTimelineContainer) return

        const initialRect = initialTimelineContainer.getBoundingClientRect()
        const trackLabelWidth = 64 // w-16 in Tailwind = 64px
        const borderWidth = 1 // border-r adds 1px
        const totalOffset = trackLabelWidth + borderWidth
        const clipWidth = (capturedFrames.length / 30) * 100 * timelineZoom

        const handleMouseMove = (e: MouseEvent) => {
            // Use the initial container rect, ignore vertical movement
            const relativeX = e.clientX - initialRect.left - totalOffset
            const progress = Math.max(0, Math.min(1, relativeX / clipWidth))
            const frameIndex = Math.min(Math.floor(progress * (capturedFrames.length - 1)), capturedFrames.length - 1)

            onScrubTimeline(frameIndex)
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        // Prevent default to avoid text selection
        e.preventDefault()
    }

    // Left trim handle dragging functionality
    const onLeftTrimMouseDown = (e: React.MouseEvent) => {
        if (capturedFrames.length === 0) return

        // Get the initial timeline container reference
        const initialTimelineContainer = (e.target as HTMLElement).closest('.timeline-track-container')
        if (!initialTimelineContainer) return

        const initialRect = initialTimelineContainer.getBoundingClientRect()
        const trackLabelWidth = 64 // w-16 in Tailwind = 64px
        const borderWidth = 1 // border-r adds 1px
        const totalOffset = trackLabelWidth + borderWidth
        const clipWidth = (capturedFrames.length / 30) * 100 * timelineZoom

        const handleMouseMove = (e: MouseEvent) => {
            // Use the initial container rect, ignore vertical movement
            const relativeX = e.clientX - initialRect.left - totalOffset
            const progress = Math.max(0, Math.min(1, relativeX / clipWidth))
            const frameIndex = Math.floor(progress * capturedFrames.length)

            // Ensure left trim doesn't exceed right trim
            const newLeftTrim = Math.min(frameIndex, clipTrimEnd - 1)
            setClipTrimStart(Math.max(0, newLeftTrim))
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        // Prevent default to avoid text selection
        e.preventDefault()
        e.stopPropagation()
    }

    // Right trim handle dragging functionality
    const onRightTrimMouseDown = (e: React.MouseEvent) => {
        if (capturedFrames.length === 0) return

        // Get the initial timeline container reference
        const initialTimelineContainer = (e.target as HTMLElement).closest('.timeline-track-container')
        if (!initialTimelineContainer) return

        const initialRect = initialTimelineContainer.getBoundingClientRect()
        const trackLabelWidth = 64 // w-16 in Tailwind = 64px
        const borderWidth = 1 // border-r adds 1px
        const totalOffset = trackLabelWidth + borderWidth
        const clipWidth = (capturedFrames.length / 30) * 100 * timelineZoom

        const handleMouseMove = (e: MouseEvent) => {
            // Use the initial container rect, ignore vertical movement
            const relativeX = e.clientX - initialRect.left - totalOffset
            const progress = Math.max(0, Math.min(1, relativeX / clipWidth))
            const frameIndex = Math.floor(progress * capturedFrames.length)

            // Ensure right trim doesn't go below left trim
            const newRightTrim = Math.max(frameIndex, clipTrimStart + 1)
            setClipTrimEnd(Math.min(capturedFrames.length - 1, newRightTrim))
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        // Prevent default to avoid text selection
        e.preventDefault()
        e.stopPropagation()
    }

    // Apply smoothing filter to waveform data
    const smoothWaveform = (waveformData: number[]): number[] => {
        if (waveformData.length < 5) return waveformData

        let smoothed = [...waveformData]
        const windowSize = 5 // Larger smoothing window

        // Apply moving average filter (multiple passes for smoother result)
        for (let pass = 0; pass < 2; pass++) {
            const passData = [...smoothed]
            for (let i = 2; i < smoothed.length - 2; i++) {
                let sum = 0
                let count = 0

                // Average with neighboring points
                for (
                    let j = Math.max(0, i - Math.floor(windowSize / 2));
                    j <= Math.min(smoothed.length - 1, i + Math.floor(windowSize / 2));
                    j++
                ) {
                    sum += passData[j]
                    count++
                }

                smoothed[i] = sum / count
            }
        }

        // Stronger exponential smoothing for more natural curves
        const alpha = 0.35 // Increased smoothing factor
        for (let i = 1; i < smoothed.length; i++) {
            smoothed[i] = alpha * smoothed[i - 1] + (1 - alpha) * smoothed[i]
        }

        // Reverse pass for bidirectional smoothing
        for (let i = smoothed.length - 2; i >= 0; i--) {
            smoothed[i] = alpha * smoothed[i + 1] + (1 - alpha) * smoothed[i]
        }

        return smoothed
    }

    // Generate waveform data from real-time audio chunks
    const generateRealtimeWaveformData = (audioChunks: Float32Array[], width: number): number[] => {
        if (audioChunks.length === 0) return []

        // Combine all audio chunks into one array
        const totalSamples = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0)
        const combinedSamples = new Float32Array(totalSamples)
        let offset = 0
        for (const chunk of audioChunks) {
            combinedSamples.set(chunk, offset)
            offset += chunk.length
        }

        const samplesPerPixel = combinedSamples.length / width
        const waveformData: number[] = []

        // Find global max for normalization
        let globalMax = 0
        for (let i = 0; i < combinedSamples.length; i++) {
            globalMax = Math.max(globalMax, Math.abs(combinedSamples[i]))
        }
        if (globalMax === 0) globalMax = 1

        // Generate waveform data
        for (let i = 0; i < width; i++) {
            const start = Math.floor(i * samplesPerPixel)
            const end = Math.floor((i + 1) * samplesPerPixel)

            let max = 0
            let rms = 0
            let count = 0

            for (let j = start; j < end; j++) {
                if (j < combinedSamples.length) {
                    const sample = Math.abs(combinedSamples[j])
                    max = Math.max(max, sample)
                    rms += sample * sample
                    count++
                }
            }

            rms = count > 0 ? Math.sqrt(rms / count) : 0
            const normalizedMax = max / globalMax
            const normalizedRms = rms / globalMax

            waveformData.push(Math.max(normalizedMax * 0.3, normalizedRms))
        }

        // Apply smoothing filter
        return smoothWaveform(waveformData)
    }

    // Generate waveform data from audio buffer
    const generateWaveformData = (audioBuffer: AudioBuffer, width: number): number[] => {
        const samples = audioBuffer.getChannelData(0) // Use first channel
        const samplesPerPixel = samples.length / width
        const waveformData: number[] = []

        // First pass: find peak values for normalization
        let globalMax = 0
        for (let i = 0; i < samples.length; i++) {
            globalMax = Math.max(globalMax, Math.abs(samples[i]))
        }

        // Avoid division by zero
        if (globalMax === 0) globalMax = 1

        // Second pass: generate normalized waveform data
        for (let i = 0; i < width; i++) {
            const start = Math.floor(i * samplesPerPixel)
            const end = Math.floor((i + 1) * samplesPerPixel)

            let max = 0
            let rms = 0
            let count = 0

            for (let j = start; j < end; j++) {
                if (j < samples.length) {
                    const sample = Math.abs(samples[j])
                    max = Math.max(max, sample)
                    rms += sample * sample
                    count++
                }
            }

            // Normalize and use RMS for smoother waveform visualization
            rms = count > 0 ? Math.sqrt(rms / count) : 0
            const normalizedMax = max / globalMax // Scale to 100% of full height
            const normalizedRms = rms / globalMax

            // Blend max and RMS, normalized to full scale
            waveformData.push(Math.max(normalizedMax * 0.3, normalizedRms))
        }

        // Apply smoothing filter
        return smoothWaveform(waveformData)
    }

    // Render waveform to canvas
    const renderWaveform = (canvas: HTMLCanvasElement, waveformData: number[], width: number, height: number) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size with 2x pixel density for high resolution
        const pixelDensity = 2
        canvas.width = width * pixelDensity
        canvas.height = height * pixelDensity
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.scale(pixelDensity, pixelDensity)

        ctx.clearRect(0, 0, width, height)

        const labelHeight = 16 // Height of the label at bottom (h-4 = 16px)
        const bottomY = height - labelHeight // Zero line right on top of label
        const maxAmplitude = height - labelHeight // Use full available height

        // Create gradient fill (80% opacity at top, 20% at bottom)
        const gradient = ctx.createLinearGradient(0, 0, 0, bottomY)
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.7)') // 80% opacity at top
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)') // 20% opacity at bottom

        // Draw filled waveform area
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(0, bottomY)

        // Draw waveform peaks going upward from bottom
        for (let x = 0; x < waveformData.length; x++) {
            // Boost amplitude to use full height (since we normalized to 0-1 range)
            const amplitude = waveformData[x] * maxAmplitude * 2 // Double to compensate for positive-only display
            const clampedAmplitude = Math.min(amplitude, maxAmplitude) // Don't exceed available height
            ctx.lineTo(x, bottomY - clampedAmplitude)
        }

        // Connect back to bottom
        ctx.lineTo(waveformData.length - 1, bottomY)
        ctx.closePath()
        ctx.fill()

        // Draw waveform outline with crisp lines
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
        ctx.lineWidth = 1
        ctx.imageSmoothingEnabled = false

        // Draw peak line
        ctx.beginPath()
        ctx.moveTo(0, bottomY)
        for (let x = 0; x < waveformData.length; x++) {
            // Boost amplitude to use full height (since we normalized to 0-1 range)
            const amplitude = waveformData[x] * maxAmplitude * 2 // Double to compensate for positive-only display
            const clampedAmplitude = Math.min(amplitude, maxAmplitude) // Don't exceed available height
            ctx.lineTo(x, bottomY - clampedAmplitude)
        }
        ctx.stroke()

        // Draw baseline at bottom (above label)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, bottomY)
        ctx.lineTo(width, bottomY)
        ctx.stroke()
    }

    // Canvas-based timeline rendering
    const timelineCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false)
    const [isDraggingLeftTrim, setIsDraggingLeftTrim] = useState(false)
    const [isDraggingRightTrim, setIsDraggingRightTrim] = useState(false)
    
    const renderTimelineCanvas = () => {
        const canvas = timelineCanvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Set canvas size with high DPI
        const rect = canvas.getBoundingClientRect()
        const pixelRatio = window.devicePixelRatio || 1
        canvas.width = rect.width * pixelRatio
        canvas.height = rect.height * pixelRatio
        ctx.scale(pixelRatio, pixelRatio)
        
        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height)
        
        // Timeline dimensions
        const trackLabelWidth = 64
        const videoTrackHeight = 80
        const audioTrackHeight = 80
        const totalHeight = videoTrackHeight + audioTrackHeight
        const clipWidth = Math.max(100, (capturedFrames.length / 30) * 100 * timelineZoom)
        const timecodeHeight = 20
        const topPadding = timecodeHeight // Space for timecode and playhead head
        
        // Draw background for tracks only
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, topPadding, rect.width, totalHeight)
        
        // Draw timecode ruler background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.fillRect(0, 0, rect.width, timecodeHeight)
        
        // Draw timecode markers
        if (capturedFrames.length > 0) {
            const totalDuration = capturedFrames.length / 30 // Assume 30fps
            const pixelsPerSecond = 100 * timelineZoom
            const secondInterval = Math.max(1, Math.floor(1 / timelineZoom)) // Adjust interval based on zoom
            
            ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
            ctx.font = '10px monospace'
            ctx.textAlign = 'left'
            
            for (let second = 0; second <= totalDuration; second += secondInterval) {
                const x = trackLabelWidth + (second * pixelsPerSecond)
                if (x < rect.width) {
                    // Draw tick mark
                    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(x, 0)
                    ctx.lineTo(x, timecodeHeight)
                    ctx.stroke()
                    
                    // Draw timecode
                    const minutes = Math.floor(second / 60)
                    const secs = second % 60
                    const timecode = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                    ctx.fillText(timecode, x + 4, timecodeHeight - 4)
                }
            }
        }
        
        // Draw track labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.fillRect(0, topPadding, trackLabelWidth, videoTrackHeight)
        ctx.fillRect(0, topPadding + videoTrackHeight, trackLabelWidth, audioTrackHeight)
        
        // Draw track separators
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(trackLabelWidth, topPadding)
        ctx.lineTo(trackLabelWidth, topPadding + totalHeight)
        ctx.moveTo(0, topPadding + videoTrackHeight)
        ctx.lineTo(rect.width, topPadding + videoTrackHeight)
        ctx.stroke()
        
        // Draw track labels text
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('V1', trackLabelWidth / 2, topPadding + videoTrackHeight / 2 + 4)
        ctx.fillText('A1', trackLabelWidth / 2, topPadding + videoTrackHeight + audioTrackHeight / 2 + 4)
        
        if (capturedFrames.length > 0) {
            // Draw video track clip (with 2px vertical margin)
            const clipMargin = 2
            drawVideoClip(ctx, trackLabelWidth, topPadding + clipMargin, clipWidth, videoTrackHeight - (clipMargin * 2))
            
            // Draw audio track clip (with 2px vertical margin)
            drawAudioClip(ctx, trackLabelWidth, topPadding + videoTrackHeight + clipMargin, clipWidth, audioTrackHeight - (clipMargin * 2))
            
            // Draw trim overlays
            drawTrimOverlays(ctx, trackLabelWidth, topPadding, clipWidth, totalHeight)
            
            // Draw playhead
            drawPlayhead(ctx, trackLabelWidth, topPadding + totalHeight)
        }
    }
    
    const drawVideoClip = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
        // Create rounded clip path
        const borderRadius = 4
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, borderRadius)
        ctx.clip()
        
        // Clip background
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.fillRect(x, y, width, height)
        
        // Calculate proper thumbnail dimensions to fill the full track height
        const videoAspectRatio = 16 / 9 // Assume 16:9 for camera feeds
        const availableHeight = height - 16 // Reserve space for label
        const availableWidth = width
        
        // Make thumbnails fill the full available height
        let thumbnailHeight = availableHeight
        let thumbnailWidth = thumbnailHeight * videoAspectRatio
        
        // Don't scale down - let thumbnails be their natural size and tile across
        
        // Draw thumbnails extending across full clip width
        const totalThumbnails = Math.ceil(availableWidth / thumbnailWidth)
        for (let i = 0; i < totalThumbnails; i++) {
            const frameIndex = Math.floor((i / totalThumbnails) * capturedFrames.length)
            const frame = capturedFrames[frameIndex]
            
            if (frame?.imageBitmap) {
                const thumbnailX = x + (i * thumbnailWidth)
                const thumbnailY = y
                
                // Only draw if thumbnail starts within bounds
                if (thumbnailX < x + availableWidth) {
                    // Calculate how much of the thumbnail to draw (for overflow clipping)
                    const maxDrawWidth = Math.max(0, x + availableWidth - thumbnailX)
                    const actualDrawWidth = Math.min(thumbnailWidth, maxDrawWidth)
                    
                    if (actualDrawWidth > 0) {
                        // Calculate source rectangle to maintain aspect ratio
                        const sourceWidth = (actualDrawWidth / thumbnailWidth) * frame.imageBitmap.width
                        
                        ctx.drawImage(
                            frame.imageBitmap,
                            0, 0, sourceWidth, frame.imageBitmap.height,
                            thumbnailX, thumbnailY, actualDrawWidth, thumbnailHeight
                        )
                    }
                }
            }
        }
        
        ctx.restore()
        
        // Clip border with rounded corners
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, borderRadius)
        ctx.stroke()
        
        // Clip label with rounded bottom corners
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y + height - 16, width, 16, [0, 0, borderRadius, borderRadius])
        ctx.clip()
        ctx.fillStyle = 'rgba(0,0,0, 0.7)'
        ctx.fillRect(x, y + height - 16, width, 16)
        ctx.restore()
        
        ctx.fillStyle = 'rgba(99, 102, 241, 0.7)'
        ctx.font = '10px monospace'
        ctx.textAlign = 'left'
        ctx.fillText('Video Clip', x + 8, y + height - 4)
    }
    
    const drawAudioClip = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
        // Create rounded clip path
        const borderRadius = 4
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, borderRadius)
        ctx.clip()
        
        // Clip background
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.fillRect(x, y, width, height)
        
        // Draw waveform
        if (capturedAudio.length > 0 && capturedAudio[0]) {
            const waveformData = generateWaveformData(capturedAudio[0].audioBuffer, Math.floor(width))
            drawWaveformInCanvas(ctx, x, y, width, height - 16, waveformData)
        } else if (isRecording && realtimeAudioData.length > 0) {
            const waveformData = generateRealtimeWaveformData(realtimeAudioData, Math.floor(width))
            drawWaveformInCanvas(ctx, x, y, width, height - 16, waveformData)
        } else if (isRecording) {
            // Recording indicator
            ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
            ctx.font = '12px monospace'
            ctx.textAlign = 'center'
            ctx.fillText('🎤 Recording...', x + width / 2, y + height / 2)
        }
        
        ctx.restore()
        
        // Clip border with rounded corners
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, borderRadius)
        ctx.stroke()
        
        // Clip label with rounded bottom corners
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y + height - 16, width, 16, [0, 0, borderRadius, borderRadius])
        ctx.clip()
        ctx.fillStyle = 'rgba(0,0,0, 0.7)'
        ctx.fillRect(x, y + height - 16, width, 16)
        ctx.restore()
        
        ctx.fillStyle = 'rgba(99, 102, 241, 0.7)'
        ctx.font = '10px monospace'
        ctx.textAlign = 'left'
        ctx.fillText('Audio Clip', x + 8, y + height - 4)
    }
    
    const drawWaveformInCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, waveformData: number[]) => {
        if (waveformData.length === 0) return
        
        const bottomY = y + height
        const maxAmplitude = height
        
        // Create gradient fill
        const gradient = ctx.createLinearGradient(x, y, x, bottomY)
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.7)')
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)')
        
        // Draw filled waveform area
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, bottomY)
        
        for (let i = 0; i < waveformData.length; i++) {
            const amplitude = waveformData[i] * maxAmplitude * 2
            const clampedAmplitude = Math.min(amplitude, maxAmplitude)
            ctx.lineTo(x + i, bottomY - clampedAmplitude)
        }
        
        ctx.lineTo(x + waveformData.length, bottomY)
        ctx.closePath()
        ctx.fill()
        
        // Draw waveform outline
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, bottomY)
        for (let i = 0; i < waveformData.length; i++) {
            const amplitude = waveformData[i] * maxAmplitude * 2
            const clampedAmplitude = Math.min(amplitude, maxAmplitude)
            ctx.lineTo(x + i, bottomY - clampedAmplitude)
        }
        ctx.stroke()
    }
    
    const drawTrimOverlays = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
        if (clipTrimStart > 0) {
            const trimWidth = (clipTrimStart / Math.max(1, capturedFrames.length - 1)) * width
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(x, y, trimWidth, height)
        }
        
        if (clipTrimEnd < capturedFrames.length - 1) {
            const trimStartX = ((clipTrimEnd + 1) / Math.max(1, capturedFrames.length - 1)) * width
            const trimWidth = width - trimStartX
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(x + trimStartX, y, trimWidth, height)
        }
    }
    
    const drawPlayhead = (ctx: CanvasRenderingContext2D, offsetX: number, totalHeight: number) => {
        const clipWidth = Math.max(100, (capturedFrames.length / 30) * 100 * timelineZoom)
        const playheadX = offsetX + (currentFrameIndex / Math.max(1, capturedFrames.length - 1)) * clipWidth
        
        // Playhead line
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(playheadX, 8)
        ctx.lineTo(playheadX, totalHeight)
        ctx.stroke()
        
        // Playhead circular head
        ctx.fillStyle = 'rgba(99, 102, 241, 1)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(playheadX, 8, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    }
    
    // Update timeline rendering on state changes
    useEffect(() => {
        renderTimelineCanvas()
    }, [capturedFrames, capturedAudio, realtimeAudioData, isRecording, currentFrameIndex, clipTrimStart, clipTrimEnd, timelineZoom])

    // Handle global mouse events for canvas dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            const canvas = timelineCanvasRef.current
            if (!canvas || (!isDraggingPlayhead && !isDraggingLeftTrim && !isDraggingRightTrim)) return
            
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            
            const trackLabelWidth = 64
            const clipX = trackLabelWidth
            const clipWidth = Math.max(100, (capturedFrames.length / 30) * 100 * timelineZoom)
            
            if (isDraggingPlayhead) {
                const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
                const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
                onScrubTimeline(frameIndex)
            } else if (isDraggingLeftTrim) {
                const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
                const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
                const newLeftTrim = Math.max(0, Math.min(clipTrimEnd - 1, frameIndex))
                setClipTrimStart(newLeftTrim)
            } else if (isDraggingRightTrim) {
                const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
                const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
                const newRightTrim = Math.max(clipTrimStart + 1, Math.min(capturedFrames.length - 1, frameIndex))
                setClipTrimEnd(newRightTrim)
            }
        }

        const handleGlobalMouseUp = () => {
            setIsDraggingPlayhead(false)
            setIsDraggingLeftTrim(false)
            setIsDraggingRightTrim(false)
        }

        if (isDraggingPlayhead || isDraggingLeftTrim || isDraggingRightTrim) {
            document.addEventListener('mousemove', handleGlobalMouseMove)
            document.addEventListener('mouseup', handleGlobalMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isDraggingPlayhead, isDraggingLeftTrim, isDraggingRightTrim, capturedFrames.length, timelineZoom, clipTrimStart, clipTrimEnd, onScrubTimeline])
    
    // Handle canvas mouse events
    const handleTimelineMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = timelineCanvasRef.current
        if (!canvas) return
        
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const trackLabelWidth = 64
        const videoTrackHeight = 80
        const topPadding = 20
        const clipX = trackLabelWidth
        const clipWidth = Math.max(100, (capturedFrames.length / 30) * 100 * timelineZoom)
        
        // Check if clicking on playhead (with expanded tolerance)
        const playheadX = clipX + (currentFrameIndex / Math.max(1, capturedFrames.length - 1)) * clipWidth
        if (Math.abs(x - playheadX) < 8 && y >= topPadding) {
            setIsDraggingPlayhead(true)
            return
        }
        
        // Check if clicking on trim handles (only in track areas)
        if (x >= clipX && x <= clipX + clipWidth && y >= topPadding) {
            const leftTrimX = clipX + (clipTrimStart / Math.max(1, capturedFrames.length - 1)) * clipWidth
            const rightTrimX = clipX + ((clipTrimEnd + 1) / Math.max(1, capturedFrames.length - 1)) * clipWidth
            
            if (Math.abs(x - leftTrimX) < 8) {
                setIsDraggingLeftTrim(true)
                return
            }
            
            if (Math.abs(x - rightTrimX) < 8) {
                setIsDraggingRightTrim(true)
                return
            }
        }
        
        // Allow scrubbing by clicking anywhere in the timeline area (including timecode ruler)
        if (x >= clipX && x <= clipX + clipWidth) {
            const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
            const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
            onScrubTimeline(frameIndex)
            // Start dragging playhead after scrubbing
            setIsDraggingPlayhead(true)
        }
    }
    
    const handleTimelineMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = timelineCanvasRef.current
        if (!canvas) return
        
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        
        const trackLabelWidth = 64
        const clipX = trackLabelWidth
        const clipWidth = Math.max(100, (capturedFrames.length / 30) * 100 * timelineZoom)
        
        if (isDraggingPlayhead) {
            const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
            const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
            onScrubTimeline(frameIndex)
        } else if (isDraggingLeftTrim) {
            const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
            const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
            const newLeftTrim = Math.max(0, Math.min(clipTrimEnd - 1, frameIndex))
            setClipTrimStart(newLeftTrim)
        } else if (isDraggingRightTrim) {
            const progress = Math.max(0, Math.min(1, (x - clipX) / clipWidth))
            const frameIndex = Math.floor(progress * (capturedFrames.length - 1))
            const newRightTrim = Math.max(clipTrimStart + 1, Math.min(capturedFrames.length - 1, frameIndex))
            setClipTrimEnd(newRightTrim)
        }
    }
    
    const handleTimelineMouseUp = () => {
        setIsDraggingPlayhead(false)
        setIsDraggingLeftTrim(false)
        setIsDraggingRightTrim(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
                <Button onClick={connected ? onDisconnect : onConnect}>{connected ? 'Disconnect' : 'Connect'}</Button>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={showConsole}
                        onChange={e => setShowConsole(e.target.checked)}
                        className="w-4 h-4"
                    />
                    Display Console
                </label>
                {audioDevices.length > 0 && (
                    <label className="flex items-center gap-2 text-sm">
                        <span>Audio Device:</span>
                        <select
                            value={selectedAudioDevice}
                            onChange={e => setSelectedAudioDevice(e.target.value)}
                            className="px-2 py-1 text-sm border border-primary/20 rounded bg-primary/5 text-primary/80"
                        >
                            {audioDevices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Microphone ${device.deviceId.slice(-4)}`}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            {/* Always show live view frame */}
            <div className="relative flex justify-center">
                <div className="relative border border-primary/10 rounded-md overflow-hidden bg-primary/5">
                    {streaming || isPlayingback || capturedFrames.length > 0 ? (
                        <canvas
                            ref={canvasRef}
                            className="max-w-[80vw] max-h-[60vh] block"
                            style={{
                                display: streaming || isPlayingback || capturedFrames.length > 0 ? 'block' : 'none',
                            }}
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
                            onClick={onToggleRecording}
                            disabled={!connected}
                            className={`w-8! h-8! rounded-md flex items-center justify-center text-primary/30 transition-all ${
                                isRecording ? 'bg-red-600/70! hover:bg-red-600/90!' : 'bg-black/50! hover:bg-black/70!'
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill={isRecording ? '#fff' : 'var(--color-red-400)'}
                                viewBox="0 0 256 256"
                            >
                                {isRecording ? (
                                    <path d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Z" />
                                ) : (
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm72-88a72,72,0,1,1-72-72A72.08,72.08,0,0,1,200,128Z"></path>
                                )}
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Canvas-Based Video Editor Timeline */}
            <div className="w-full max-w-[80vw] border border-primary/10 rounded-md bg-primary/10 overflow-hidden">
                {/* Timeline Header */}
                <div className="flex items-center justify-between px-3 py-1 border-b border-primary/10 bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-mono font-medium text-primary/70">
                            {formatTimecode(currentFrameIndex)}
                        </div>
                        {capturedFrames.length > 0 &&
                            (clipTrimStart > 0 || clipTrimEnd < capturedFrames.length - 1) && (
                                <div className="text-xs font-mono text-primary/50">
                                    Trim: {formatTimecode(clipTrimStart)} - {formatTimecode(clipTrimEnd)}
                                </div>
                            )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={onTogglePlayback}
                            className="w-8! h-8! bg-black/50! hover:bg-black/70! rounded-md flex items-center justify-center text-primary/30 transition-all"
                            disabled={capturedFrames.length === 0}
                        >
                            {isPlayingback ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-primary/50">Zoom:</span>
                            <input
                                type="range"
                                min={0.1}
                                max={5}
                                step={0.1}
                                value={timelineZoom}
                                onChange={e => setTimelineZoom(Number(e.target.value))}
                                className="w-16 h-1"
                            />
                            <span className="text-xs text-primary/50 w-8">{timelineZoom.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>

                {/* Canvas Timeline */}
                <canvas
                    ref={timelineCanvasRef}
                    className="w-full cursor-pointer"
                    height="180"
                    onMouseDown={handleTimelineMouseDown}
                    onMouseMove={handleTimelineMouseMove}
                    onMouseUp={handleTimelineMouseUp}
                    style={{ display: 'block', height: '180px' }}
                />
            </div>

            {/* Terminal-like console output */}
            {showConsole && (
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
                                    color:
                                        msg.type === 'error'
                                            ? '#ef4444'
                                            : msg.type === 'warn'
                                              ? '#f59e0b'
                                              : msg.type === 'info'
                                                ? '#3b82f6'
                                                : '#4ade80cc',
                                }}
                            >
                                <span className="opacity-50">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>{' '}
                                {msg.message}
                            </div>
                        ))}
                        {consoleMessages.length === 0 && (
                            <div className="text-primary/30">Console output will appear here...</div>
                        )}
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

import { Camera } from '@jpglab/fuse/web'
import { useEffect, useState } from "react";
import React from 'react'

export default function Home() {
  const [camera, setCamera] = useState<Camera | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [hasWebUSB, setHasWebUSB] = useState(false)
  const [photoData, setPhotoData] = useState<string | null>(null)

  // Check WebUSB support after mounting
  useEffect(() => {
    setHasWebUSB('usb' in navigator)
  }, [])

  // Connect to camera using library's auto-discovery
  const connectCamera = async () => {
    try {
      setConnecting(true)
      setError('')
      setConnectionStatus('Requesting device access...')
      
      // Create progress timeout to show stages
      const statusTimer = setInterval(() => {
        setConnectionStatus(prev => {
          if (prev.includes('Requesting')) return 'Opening USB device...'
          if (prev.includes('Opening')) return 'Establishing PTP session...'
          if (prev.includes('PTP')) return 'Waiting for camera response...'
          return prev
        })
      }, 2000)
      
      // Add timeout to prevent infinite wait
      const timeoutMs = 15000
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Connection timeout after ${timeoutMs/1000} seconds. Camera may not be responding.`)), timeoutMs)
      )
      
      // Just like in Node.js - create camera and connect!
      const cam = new Camera()
      console.log('Camera instance created, calling connect...')
      
      const connectPromise = cam.connect()
      await Promise.race([connectPromise, timeoutPromise])
      
      clearInterval(statusTimer)
      setCamera(cam)
      setConnected(true)
      setConnecting(false)
      setConnectionStatus('')
      console.log('Connected to camera successfully!')
    } catch (err: any) {
      console.error('Error connecting:', err)
      setError(err?.message || 'Failed to connect')
      setConnecting(false)
      setConnectionStatus('')
    }
  }

  // Disconnect camera
  const disconnectCamera = async () => {
    try {
      if (camera) {
        await camera.disconnect()
        setCamera(null)
        setConnected(false)
        console.log('Disconnected from camera')
      }
    } catch (err: any) {
      console.error('Error disconnecting:', err)
      setError(err?.message || 'Failed to disconnect')
    }
  }

  // Take a photo
  const takePhoto = async () => {
    try {
      if (!camera) return
      
      setError('')
      setPhotoData(null) // Clear previous photo
      
      const photo = await camera.takePhoto()
      
      // Check if we got actual image data or just a confirmation
      if (photo.data && photo.data.length > 0) {
        // Convert photo data to base64 for display (handling large buffers properly)
        const uint8Array = new Uint8Array(photo.data)
        let binary = ''
        const chunkSize = 8192 // Process in chunks to avoid stack overflow
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize)
          binary += String.fromCharCode.apply(null, Array.from(chunk))
        }
        const base64 = btoa(binary)
        setPhotoData(`data:image/jpeg;base64,${base64}`)
        console.log('Photo captured and downloaded!')
      } else {
        // Photo was taken but saved to memory card only
        setError('')
        setPhotoData('captured') // Special flag for captured but not downloaded
        console.log('Photo captured successfully (saved to memory card)')
      }
    } catch (err: any) {
      console.error('Error taking photo:', err)
      setError(err?.message || 'Failed to take photo')
    }
  }

  // Get camera settings
  const getCameraInfo = async () => {
    try {
      if (!camera) return
      
      const iso = await camera.getISO()
      const shutter = await camera.getShutterSpeed()
      const aperture = await camera.getAperture()
      
      console.log('Camera settings:', {
        vendor: camera.vendor,
        model: camera.model,
        iso,
        shutter,
        aperture
      })
    } catch (err: any) {
      console.error('Error getting camera info:', err)
    }
  }

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Fuse Camera Library - Web Example</h1>
        <p className="text-gray-600 mb-4">Same API, works in the browser!</p>
        
        {/* WebUSB status */}
        <div className="mb-6">
          WebUSB Support: {hasWebUSB ? '✅ Available' : '❌ Not Available'}
        </div>

        {/* Connection controls */}
        <div className="space-x-2">
          {!connected ? (
            <button 
              onClick={connectCamera}
              disabled={connecting || !hasWebUSB}
              className={`px-4 py-2 rounded text-white ${
                connecting || !hasWebUSB
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {connecting ? (connectionStatus || 'Connecting...') : 'Connect Camera'}
            </button>
          ) : (
            <>
              <button 
                onClick={disconnectCamera}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Disconnect
              </button>
              <button 
                onClick={takePhoto}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Take Photo
              </button>
              <button 
                onClick={getCameraInfo}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Get Info
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="text-center max-w-2xl">
        {/* Connection status display */}
        {connecting && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connection Progress</h3>
            <p className="text-blue-700">{connectionStatus}</p>
            <div className="mt-2">
              <div className="animate-pulse inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              <div className="animate-pulse inline-block w-2 h-2 bg-blue-500 rounded-full mr-1" style={{animationDelay: '0.2s'}}></div>
              <div className="animate-pulse inline-block w-2 h-2 bg-blue-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">This may take up to 15 seconds...</p>
          </div>
        )}

        {connected && camera && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Connected Camera</h2>
            <div className="text-left">
              <p>Vendor: {camera.vendor}</p>
              <p>Model: {camera.model}</p>
              <p>Serial: {camera.serialNumber}</p>
            </div>
          </div>
        )}

        {/* Photo display */}
        {photoData === 'captured' ? (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-700">✅ Photo Captured!</h3>
            <p className="text-green-600">Photo was saved to your camera's memory card.</p>
            <p className="text-sm text-gray-600 mt-2">
              Note: Some cameras save directly to SD card and don't allow downloading via USB.
            </p>
          </div>
        ) : photoData && photoData !== 'captured' ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Captured Photo</h3>
            <img 
              src={photoData} 
              alt="Captured" 
              className="max-w-full rounded shadow-lg"
            />
          </div>
        ) : null}

        {/* Instructions */}
        {!connected && (
          <div className="text-gray-600">
            <p className="mb-2">Click "Connect Camera" to auto-discover and connect to your camera.</p>
            <p className="text-sm">The browser will prompt you to select a USB device.</p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg max-w-xl">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Code example */}
      <div className="text-center max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Same Simple API</h3>
        <pre className="bg-gray-100 p-4 rounded text-left text-sm">
          <code>{`import { Camera } from '@jpglab/fuse/web'

const camera = new Camera()
await camera.connect()

const photo = await camera.takePhoto()
await camera.disconnect()`}</code>
        </pre>
      </div>
    </div>
  );
}
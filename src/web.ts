/**
 * @jpglab/fuse - Web/Browser Entry Point
 *
 * This entry point excludes Node.js-specific features like USB device discovery
 * and filesystem operations. Use WebUSB API for camera connections.
 */

// Re-export all common exports
export * from './exports'

// Note: Discovery functions (listCameras, watchCameras) are NOT exported here
// as they require Node.js USB libraries. Use WebUSB API directly in browser.

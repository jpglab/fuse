/**
 * @jpglab/fuse - Node.js Entry Point
 * 
 * Full-featured entry point with USB device discovery and filesystem operations.
 */

// Re-export all common exports
export * from './exports'

// Node.js-specific discovery functions (direct from discovery-node)
export { listCameras } from './client/discovery-node'
export { watchCameras } from './client/discovery'
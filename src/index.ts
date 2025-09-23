/**
 * @jpglab/fuse - Main entry point with runtime discovery support
 */

// Re-export all common exports
export * from './exports'

// Discovery functions with runtime detection
export { listCameras, watchCameras } from './client/discovery'
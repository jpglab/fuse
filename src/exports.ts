/**
 * Common exports shared across all entry points
 */

// ============================================================================
// Client Layer - Primary API
// ============================================================================
export { Camera } from '@api/camera'
export { Photo } from '@api/photo'
export { Frame } from '@api/frame'
export type { CameraOptions } from '@api/types'

// ============================================================================
// Camera Layer
// ============================================================================
// Interfaces
export type { CameraInterface, StorageInfo } from '@camera/interfaces/camera.interface'
export type { ImageInfo, ImageData } from '@camera/interfaces/image.interface'
export type {
    LiveViewFrame,
    FrameMetadata,
} from '@camera/interfaces/liveview.interface'

// Enums
export { ImageFormat } from '@camera/interfaces/image.interface'
export { FrameFormat } from '@camera/interfaces/liveview.interface'

// ============================================================================
// Core Layer
// ============================================================================
export type {
    ProtocolInterface,
    Operation,
    Response,
    Event,
} from '@core/ptp-protocol'
export type {
    MessageBuilderInterface,
} from '@core/ptp-message-builder'
export { MessageType } from '@core/ptp-protocol'

// ============================================================================
// Transport Layer
// ============================================================================
export type { TransportInterface } from '@transport/interfaces/transport.interface'
export type {
    DeviceDescriptor,
    TransportOptions,
    DeviceSearchCriteria,
} from '@transport/interfaces/transport.interface'
export type {
    EndpointManagerInterface,
    EndpointConfiguration,
    DeviceFinderInterface,
} from '@transport/interfaces/transport.interface'
export { TransportType, EndpointType } from '@transport/interfaces/transport.interface'

// ============================================================================
// Constants
// ============================================================================
export { DataType } from '@constants/types'
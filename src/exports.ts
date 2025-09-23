/**
 * Common exports shared across all entry points
 */

// ============================================================================
// Client Layer - Primary API
// ============================================================================
export { Camera } from '@client/camera'
export { Photo } from '@client/photo'
export { Frame } from '@client/frame'
export type { CameraOptions } from '@client/types'

// ============================================================================
// Camera Layer
// ============================================================================
// Interfaces
export type { CameraInterface, StorageInfo } from '@camera/interfaces/camera.interface'
export type { ImageInfo, ImageData } from '@camera/interfaces/image.interface'
export type {
    LiveViewFrame,
    FrameMetadata,
    FocusInfo,
    FocusArea,
    ExposureInfo,
    WhiteBalanceInfo,
    FaceInfo,
} from '@camera/interfaces/liveview.interface'

// Enums
export { ImageFormat } from '@camera/interfaces/image.interface'
export { FrameFormat, FocusStatus } from '@camera/interfaces/liveview.interface'
export { DeviceProperty } from '@camera/properties/device-properties'

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
    ParsedData,
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
} from '@transport/interfaces/device.interface'
export type {
    EndpointManagerInterface,
    EndpointConfiguration,
    DeviceFinderInterface,
} from '@transport/interfaces/endpoint.interface'
export { TransportType } from '@transport/interfaces/device.interface'
export { EndpointType } from '@transport/interfaces/endpoint.interface'

// ============================================================================
// Constants
// ============================================================================
export { DataType } from '@constants/types'
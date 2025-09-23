/**
 * Common exports shared across all entry points
 */

// Client Layer - Primary API
export { Camera } from './client/camera'
export { Photo } from './client/photo'
export { Frame } from './client/frame'
export type {
    CameraOptions,
    CameraDescriptor,
    ExposureMode,
} from './client/types'

// Export the interface types separately to avoid naming conflicts
export type { Photo as IPhoto, Frame as IFrame } from './client/types'

// Property constants for advanced usage
export { DeviceProperty } from '@camera/properties/device-properties'

// Export interfaces for advanced users
export type { CameraInterface } from '@camera/interfaces/camera.interface'
export type { TransportInterface, DeviceIdentifier, TransportType } from '@transport/interfaces/transport.interface'
export type { ProtocolInterface, Operation, Response, Event } from '@core/interfaces/protocol.interface'
// Export camera layer types
export type { CameraInfo, StorageInfo } from '@camera/interfaces/camera.interface'
export type { ImageInfo, ImageData } from '@camera/interfaces/image.interface'
export { ImageFormat } from '@camera/interfaces/image.interface'
export type {
    LiveViewFrame,
    FrameMetadata,
    FocusInfo,
    FocusArea,
    ExposureInfo,
    WhiteBalanceInfo,
    FaceInfo,
} from '@camera/interfaces/liveview.interface'
export { FrameFormat, FocusStatus } from '@camera/interfaces/liveview.interface'

// Export core layer types
export type {
    MessageBuilderInterface,
    ParsedResponse,
    ParsedEvent,
    ParsedData,
    DataConverterInterface,
} from '@core/interfaces/message-builder.interface'
export { MessageType, PTPDataType } from '@core/interfaces/message-builder.interface'

// Export transport layer types
export type {
    EndpointManagerInterface,
    EndpointConfiguration,
    DeviceFinderInterface,
    DeviceSearchCriteria,
    DeviceDescriptor,
} from '@transport/interfaces/endpoint.interface'
export { EndpointType } from '@transport/interfaces/endpoint.interface'
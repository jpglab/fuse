/**
 * Common exports shared across all entry points
 */

// ============================================================================
// Client Layer - Primary API
// ============================================================================
export { Camera } from '@api/camera'
export { Photo } from '@api/photo'
export { Frame } from '@api/frame'

// ============================================================================
// Camera Layer
// ============================================================================
// Interfaces
export type { CameraInterface, CameraOptions, StorageInfo } from '@camera/interfaces/camera.interface'

// ============================================================================
// Core Layer
// ============================================================================
export type { ProtocolInterface } from '@core/protocol'
export type { MessageBuilderInterface, MessageParserInterface } from '@core/messages'
export type { Operation, Response, Event } from '@constants/types'
export { MessageType } from '@constants/types'

// ============================================================================
// Transport Layer
// ============================================================================
export type { TransportInterface } from '@transport/interfaces/transport.interface'
export type {
    DeviceDescriptor,
    DeviceSearchCriteria,
    DeviceFinderInterface,
} from '@transport/interfaces/device.interface'
export type {
    EndpointManagerInterface,
    EndpointConfiguration,
} from '@transport/interfaces/endpoint.interface'
export { EndpointType } from '@transport/interfaces/endpoint.interface'
export { TransportType } from '@transport/interfaces/transport-types'
export type { TransportOptions } from '@transport/interfaces/transport-types'

// ============================================================================
// Constants
// ============================================================================
export { DataType } from '@constants/types'
export { ContainerTypes } from '@constants/ptp/containers'
export type { ContainerType } from '@constants/ptp/containers'
export type { PropertyDescriptor, Property, PropertyDefinition } from '@constants/types'

// ============================================================================
// Errors
// ============================================================================
export { PTPError } from '@constants/ptp/errors'
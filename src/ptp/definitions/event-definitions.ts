import { EventDefinition } from '@ptp/types/event'

/** Undefined event */
export const Undefined = {
    code: 0x4000,
    name: 'Undefined',
    description: 'Undefined event',
    parameters: [],
} as const satisfies EventDefinition

/** CancelTransaction event */
export const CancelTransaction = {
    code: 0x4001,
    name: 'CancelTransaction',
    description: 'Cancel a transaction',
    parameters: [],
} as const satisfies EventDefinition

/** ObjectAdded event */
export const ObjectAdded = {
    code: 0x4002,
    name: 'ObjectAdded',
    description: 'New data object added to device',
    parameters: [
        {
            name: 'ObjectHandle',
            description: 'Handle of the new object',
            type: 'ObjectHandle',
        },
    ],
} as const satisfies EventDefinition

/** ObjectRemoved event */
export const ObjectRemoved = {
    code: 0x4003,
    name: 'ObjectRemoved',
    description: 'Data object removed from device',
    parameters: [
        {
            name: 'ObjectHandle',
            description: 'Handle of the removed object',
            type: 'ObjectHandle',
        },
    ],
} as const satisfies EventDefinition

/** StoreAdded event */
export const StoreAdded = {
    code: 0x4004,
    name: 'StoreAdded',
    description: 'New store added to device',
    parameters: [
        {
            name: 'StorageID',
            description: 'ID of the new store',
            type: 'StorageID',
        },
    ],
} as const satisfies EventDefinition

/** StoreRemoved event */
export const StoreRemoved = {
    code: 0x4005,
    name: 'StoreRemoved',
    description: 'Store removed from device',
    parameters: [
        {
            name: 'StorageID',
            description: 'ID of the removed store',
            type: 'StorageID',
        },
    ],
} as const satisfies EventDefinition

/** DevicePropChanged event */
export const DevicePropChanged = {
    code: 0x4006,
    name: 'DevicePropChanged',
    description: 'Device property value changed',
    parameters: [
        {
            name: 'DevicePropCode',
            description: 'Property that changed',
            type: 'DevicePropCode',
        },
    ],
} as const satisfies EventDefinition

/** ObjectInfoChanged event */
export const ObjectInfoChanged = {
    code: 0x4007,
    name: 'ObjectInfoChanged',
    description: 'Object information changed',
    parameters: [
        {
            name: 'ObjectHandle',
            description: 'Handle of the object',
            type: 'ObjectHandle',
        },
    ],
} as const satisfies EventDefinition

/** DeviceInfoChanged event */
export const DeviceInfoChanged = {
    code: 0x4008,
    name: 'DeviceInfoChanged',
    description: 'Device information or capabilities changed',
    parameters: [],
} as const satisfies EventDefinition

/** RequestObjectTransfer event */
export const RequestObjectTransfer = {
    code: 0x4009,
    name: 'RequestObjectTransfer',
    description: 'Responder requests object transfer',
    parameters: [
        {
            name: 'ObjectHandle',
            description: 'Handle of the requested object',
            type: 'ObjectHandle',
        },
    ],
} as const satisfies EventDefinition

/** StoreFull event */
export const StoreFull = {
    code: 0x400a,
    name: 'StoreFull',
    description: 'Store is full',
    parameters: [
        {
            name: 'StorageID',
            description: 'ID of the full store',
            type: 'StorageID',
        },
    ],
} as const satisfies EventDefinition

/** DeviceReset event */
export const DeviceReset = {
    code: 0x400b,
    name: 'DeviceReset',
    description: 'Device has been reset',
    parameters: [],
} as const satisfies EventDefinition

/** StorageInfoChanged event */
export const StorageInfoChanged = {
    code: 0x400c,
    name: 'StorageInfoChanged',
    description: 'Storage information changed',
    parameters: [
        {
            name: 'StorageID',
            description: 'ID of the changed store',
            type: 'StorageID',
        },
    ],
} as const satisfies EventDefinition

/** CaptureComplete event */
export const CaptureComplete = {
    code: 0x400d,
    name: 'CaptureComplete',
    description: 'Capture operation completed',
    parameters: [],
} as const satisfies EventDefinition

/** UnreportedStatus event */
export const UnreportedStatus = {
    code: 0x400e,
    name: 'UnreportedStatus',
    description: 'Unreported status change occurred',
    parameters: [],
} as const satisfies EventDefinition

export const genericEventRegistry = {
    Undefined,
    CancelTransaction,
    ObjectAdded,
    ObjectRemoved,
    StoreAdded,
    StoreRemoved,
    DevicePropChanged,
    ObjectInfoChanged,
    DeviceInfoChanged,
    RequestObjectTransfer,
    StoreFull,
    DeviceReset,
    StorageInfoChanged,
    CaptureComplete,
    UnreportedStatus,
} as const satisfies { [key: string]: EventDefinition }

export type GenericEventDef = (typeof genericEventRegistry)[keyof typeof genericEventRegistry]

import { OperationDefinition } from '@ptp/types/operation'
import { baseCodecs, ArrayCodec } from '@ptp/types/codec'
import { deviceInfoCodec } from '@ptp/datasets/device-info-dataset'
import { objectInfoCodec } from '@ptp/datasets/object-info-dataset'
import { storageInfoCodec } from '@ptp/datasets/storage-info-dataset'
import { devicePropDescCodec } from '@ptp/datasets/device-prop-desc-dataset'

export const operationDefinitions = [
    {
        code: 0x1000,
        name: 'Undefined',
        description: 'Undefined operation',
        dataDirection: 'none',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1001,
        name: 'GetDeviceInfo',
        description: 'Returns information and capabilities about the responder device',
        dataDirection: 'out',
        dataCodec: deviceInfoCodec,
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1002,
        name: 'OpenSession',
        description: 'Opens a session with the device',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'SessionID',
                description: 'Session identifier',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1003,
        name: 'CloseSession',
        description: 'Closes the current session',
        dataDirection: 'none',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1004,
        name: 'GetStorageIDs',
        description: 'Returns list of currently valid StorageIDs',
        dataDirection: 'out',
        dataCodec: new ArrayCodec(baseCodecs.uint32),
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1005,
        name: 'GetStorageInfo',
        description: 'Returns StorageInfo data set for a storage area',
        dataDirection: 'out',
        dataCodec: storageInfoCodec,
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage identifier',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1006,
        name: 'GetNumObjects',
        description: 'Returns number of objects in storage',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage identifier (0xFFFFFFFF for all)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Filter by format code',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
            {
                name: 'ParentObject',
                description: 'Parent association handle',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [
            {
                name: 'NumObjects',
                description: 'Number of objects',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x1007,
        name: 'GetObjectHandles',
        description: 'Returns array of ObjectHandles in storage',
        dataDirection: 'out',
        dataCodec: new ArrayCodec(baseCodecs.uint32),
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage identifier (0xFFFFFFFF for all)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Filter by format code',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
            {
                name: 'ParentObject',
                description: 'Parent association handle',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1008,
        name: 'GetObjectInfo',
        description: 'Returns ObjectInfo data set for an object',
        dataDirection: 'out',
        dataCodec: objectInfoCodec,
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1009,
        name: 'GetObject',
        description: 'Retrieves one object from the device',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x100a,
        name: 'GetThumb',
        description: 'Retrieves thumbnail for an object',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x100b,
        name: 'DeleteObject',
        description: 'Deletes an object from the device',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle (0xFFFFFFFF for all)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Filter by format code',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x100c,
        name: 'SendObjectInfo',
        description: 'Sends ObjectInfo before sending object',
        dataDirection: 'in',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Destination storage',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
            {
                name: 'ParentObjectHandle',
                description: 'Parent object handle',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [
            {
                name: 'StorageID',
                description: 'Actual storage ID',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ParentObjectHandle',
                description: 'Actual parent handle',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectHandle',
                description: 'Reserved handle for object',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x100d,
        name: 'SendObject',
        description: 'Sends object data to the device',
        dataDirection: 'in',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x100e,
        name: 'InitiateCapture',
        description: 'Initiates capture of new data objects',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage for capture',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Format for capture',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x100f,
        name: 'FormatStore',
        description: 'Formats a storage device',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage to format',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'FilesystemType',
                description: 'Filesystem type',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1010,
        name: 'ResetDevice',
        description: 'Resets device to default state',
        dataDirection: 'none',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1011,
        name: 'SelfTest',
        description: 'Performs device self-test',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'SelfTestType',
                description: 'Type of self-test',
                codec: baseCodecs.uint32,
                required: false,
                defaultValue: 0,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1012,
        name: 'SetObjectProtection',
        description: 'Sets object protection status',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ProtectionStatus',
                description: 'Protection status',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1013,
        name: 'PowerDown',
        description: 'Powers down the device',
        dataDirection: 'none',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1014,
        name: 'GetDevicePropDesc',
        description: 'Gets device property descriptor',
        dataDirection: 'out',
        dataCodec: devicePropDescCodec,
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1015,
        name: 'GetDevicePropValue',
        description: 'Gets device property value',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1016,
        name: 'SetDevicePropValue',
        description: 'Sets device property value',
        dataDirection: 'in',
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1017,
        name: 'ResetDevicePropValue',
        description: 'Resets device property to default',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1018,
        name: 'TerminateOpenCapture',
        description: 'Terminates an open capture',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'TransactionID',
                description: 'Transaction ID of capture',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1019,
        name: 'MoveObject',
        description: 'Moves object to new location',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object to move',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'StorageID',
                description: 'Destination storage',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ParentObjectHandle',
                description: 'New parent object',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x101a,
        name: 'CopyObject',
        description: 'Copies object to new location',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object to copy',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'StorageID',
                description: 'Destination storage',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ParentObjectHandle',
                description: 'New parent object',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [
            {
                name: 'ObjectHandle',
                description: 'Handle of new copy',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x101b,
        name: 'GetPartialObject',
        description: 'Gets partial object data',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'Offset',
                description: 'Offset in bytes',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'MaxBytes',
                description: 'Maximum bytes to return',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [
            {
                name: 'ActualBytes',
                description: 'Actual bytes returned',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x101c,
        name: 'InitiateOpenCapture',
        description: 'Initiates open-ended capture',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage for capture',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Format for capture',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x101d,
        name: 'StartEnumHandles',
        description: 'Initiates an enumeration process for retrieving object handles in chunks (PTP v1.1)',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage ID or 0xFFFFFFFF for all stores',
                codec: baseCodecs.uint32,
                required: false,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Filter by format or 0xFFFFFFFF for images only',
                codec: baseCodecs.uint32,
                required: false,
            },
            {
                name: 'ParentObjectHandle',
                description: 'Parent association or 0xFFFFFFFF for root',
                codec: baseCodecs.uint32,
                required: false,
            },
        ],
        responseParameters: [
            {
                name: 'EnumID',
                description: 'Unique enumeration identifier',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x101e,
        name: 'EnumHandles',
        description: 'Returns a chunk of object handles from an active enumeration (PTP v1.1)',
        dataDirection: 'out',
        dataCodec: new ArrayCodec(baseCodecs.uint32),
        operationParameters: [
            {
                name: 'EnumID',
                description: 'Enumeration identifier from StartEnumHandles',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'MaxNumberHandles',
                description: 'Maximum number of handles to return',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x101f,
        name: 'StopEnumHandles',
        description: 'Closes an active enumeration process (PTP v1.1)',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'EnumID',
                description: 'Enumeration identifier to close',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1020,
        name: 'GetVendorExtensionMaps',
        description: 'Retrieves mapping of vendor extensions (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [],
        responseParameters: [],
    },
    {
        code: 0x1021,
        name: 'GetVendorDeviceInfo',
        description: 'Retrieves DeviceInfo for a specific vendor extension (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'VendorExtensionID',
                description: 'Vendor extension ID',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1022,
        name: 'GetResizedImageObject',
        description: 'Retrieves an image object at arbitrary resolution (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Image object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ImageWidth',
                description: 'Desired width in pixels',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ImageHeight',
                description: 'Desired height in pixels (0 to maintain aspect ratio)',
                codec: baseCodecs.uint32,
                required: false,
            },
        ],
        responseParameters: [
            {
                name: 'ActualBytes',
                description: 'Number of bytes sent',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ActualWidth',
                description: 'Actual width in pixels',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ActualHeight',
                description: 'Actual height in pixels',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x1023,
        name: 'GetFilesystemManifest',
        description: 'Retrieves filesystem information in a single transaction (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'StorageID',
                description: 'Storage ID or 0xFFFFFFFF for all stores',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ObjectFormatCode',
                description: 'Filter by format',
                codec: baseCodecs.uint32,
                required: false,
            },
            {
                name: 'ParentObjectHandle',
                description: 'Parent association handle',
                codec: baseCodecs.uint32,
                required: false,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1024,
        name: 'GetStreamInfo',
        description: 'Retrieves information about a stream (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'StreamType',
                description: 'Type of stream',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x1025,
        name: 'GetStream',
        description: 'Retrieves streaming content (PTP v1.1)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'StreamType',
                description: 'Type of stream',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
] as const satisfies readonly OperationDefinition[]

// Type to extract operation names from the actual definitions
export type OperationName = (typeof operationDefinitions)[number]['name']

// Type to extract a specific operation by name
export type GetOperation<N extends OperationName> = Extract<(typeof operationDefinitions)[number], { name: N }>

export const operationsByCode = new Map(operationDefinitions.map(op => [op.code, op]))

export const operationsByName = new Map(operationDefinitions.map(op => [op.name, op]))

export function getOperationByCode(code: number): OperationDefinition | undefined {
    return operationsByCode.get(code as any) as OperationDefinition | undefined
}

export function getOperationByName(name: string): OperationDefinition | undefined {
    return operationsByName.get(name as any) as OperationDefinition | undefined
}

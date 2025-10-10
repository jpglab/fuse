import { OperationDefinition } from '@ptp/types/operation'
import { baseCodecs } from '@ptp/types/codec'
import { devicePropDescCodecEx } from '@ptp/datasets/device-prop-desc-dataset'

export const nikonOperationDefinitions = [
    {
        code: 0x9431,
        name: 'GetPartialObjectEx',
        description: 'Get partial object with 64-bit offset support (extension of GetPartialObject)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'ObjectHandle',
                description: 'Object handle',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'OffsetLower',
                description: 'Offset in bytes (lower 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'OffsetUpper',
                description: 'Offset in bytes (upper 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'MaxSizeLower',
                description: 'Maximum bytes to return (lower 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'MaxSizeUpper',
                description: 'Maximum bytes to return (upper 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [
            {
                name: 'ActualBytesSentLower',
                description: 'Actual bytes sent (lower 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
            {
                name: 'ActualBytesSentUpper',
                description: 'Actual bytes sent (upper 32 bits)',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
    },
    {
        code: 0x943a,
        name: 'GetDevicePropDescEx',
        description: 'Get device property descriptor (4-byte extension)',
        dataDirection: 'out',
        dataCodec: devicePropDescCodecEx,
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code to get descriptor for (4-byte extension)',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x943b,
        name: 'GetDevicePropValueEx',
        description: 'Get device property value (4-byte extension)',
        dataDirection: 'out',
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code to get (4-byte extension)',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
    {
        code: 0x943c,
        name: 'SetDevicePropValueEx',
        description: 'Set device property value (4-byte extension)',
        dataDirection: 'in',
        operationParameters: [
            {
                name: 'DevicePropCode',
                description: 'Property code to set (4-byte extension)',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
] as const satisfies readonly OperationDefinition[]

export function getOperationByName(name: string): OperationDefinition | undefined {
    return nikonOperationDefinitions.find(op => op.name === name)
}

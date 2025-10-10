import { CustomCodec, baseCodecs } from '@ptp/types/codec'
import { DatatypeCode } from '@ptp/types/datatype'
import { getDatatypeByCode } from '@ptp/definitions/datatype-definitions'

/**
 * Codec for variable-sized values based on their datatype
 * Used by device property descriptors to encode/decode values of different types
 */
export class VariableValueCodec extends CustomCodec<{ value: any; rawBytes: Uint8Array }> {
    readonly type = 'custom' as const

    constructor(private dataType: DatatypeCode) {
        super()
    }

    encode(value: { value: any; rawBytes: Uint8Array } | any): Uint8Array {
        // If already has rawBytes, use them
        if (value && typeof value === 'object' && 'rawBytes' in value) {
            return value.rawBytes
        }

        // Otherwise encode the raw value
        const datatypeDefinition = getDatatypeByCode(this.dataType)
        if (!datatypeDefinition) {
            throw new Error(`Unknown datatype: 0x${this.dataType.toString(16)}`)
        }
        if (!datatypeDefinition.codec) {
            throw new Error(`Datatype ${this.dataType} has no codec`)
        }

        const codec = this.resolveBaseCodec(datatypeDefinition.codec)
        return codec.encode(value)
    }

    decode(buffer: Uint8Array, offset = 0): { value: { value: any; rawBytes: Uint8Array }; bytesRead: number } {
        const datatypeDefinition = getDatatypeByCode(this.dataType)
        if (!datatypeDefinition) {
            throw new Error(`Unknown datatype: 0x${this.dataType.toString(16)}`)
        }
        if (!datatypeDefinition.codec) {
            throw new Error(`Datatype ${this.dataType} has no codec`)
        }

        const codec = this.resolveBaseCodec(datatypeDefinition.codec)
        const result = codec.decode(buffer, offset)
        const rawBytes = buffer.slice(offset, offset + result.bytesRead)

        return {
            value: {
                value: result.value,
                rawBytes,
            },
            bytesRead: result.bytesRead,
        }
    }
}

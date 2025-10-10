import { CodecDefinition, baseCodecs, CustomCodec } from '@ptp/types/codec'
import { DatatypeCode } from '@ptp/types/datatype'
import { getDatatypeByCode } from '@ptp/definitions/datatype-definitions'
import { propertyDefinitions as standardPropertyDefinitions } from '@ptp/definitions/property-definitions'
import { VariableValueCodec } from '@ptp/datasets/codecs/variable-value-codec'

export interface DevicePropDesc {
    devicePropertyCode: number
    devicePropertyName: string
    devicePropertyDescription: string
    dataType: DatatypeCode
    getSet: 'GET' | 'GET_SET'
    factoryDefaultValue: any
    currentValueRaw: any
    currentValueBytes: Uint8Array
    currentValueDecoded: any
    formFlag: number
    // Range form fields (when formFlag === 0x01)
    minimumValue?: any
    maximumValue?: any
    stepSize?: any
    // Enumeration form fields (when formFlag === 0x02)
    numberOfValues?: number
    supportedValuesRaw?: any[]
    supportedValuesDecoded?: any[]
    vendorExtensions?: {
        [key: string]: any
    }
}

export class DevicePropDescCodec extends CustomCodec<DevicePropDesc> {
    readonly type = 'custom' as const
    private use4ByteCode: boolean

    constructor(use4ByteCode: boolean = false) {
        super()
        this.use4ByteCode = use4ByteCode
    }

    encode(value: DevicePropDesc): Uint8Array {
        throw new Error('Encoding DevicePropDesc is not yet implemented')
    }

    decode(buffer: Uint8Array, offset = 0): { value: DevicePropDesc; bytesRead: number } {
        let currentOffset = offset

        if (buffer.length < 6) {
            throw new Error(`Buffer too short: expected at least 6 bytes, got ${buffer.length}`)
        }

        const u8 = this.resolveBaseCodec(baseCodecs.uint8)
        const u16 = this.resolveBaseCodec(baseCodecs.uint16)
        const u32 = this.resolveBaseCodec(baseCodecs.uint32)

        // DevicePropCode (2 or 4 bytes)
        let devicePropertyCode: number
        if (this.use4ByteCode) {
            const result = u32.decode(buffer, currentOffset)
            devicePropertyCode = result.value
            currentOffset += result.bytesRead
        } else {
            const result = u16.decode(buffer, currentOffset)
            devicePropertyCode = result.value
            currentOffset += result.bytesRead
        }

        // DataType (2 bytes)
        const dataTypeResult = u16.decode(buffer, currentOffset)
        const dataType = dataTypeResult.value as DatatypeCode
        currentOffset += dataTypeResult.bytesRead

        // GetSet (1 byte)
        const getSetResult = u8.decode(buffer, currentOffset)
        const getSet = getSetResult.value
        currentOffset += getSetResult.bytesRead

        const valueCodec = new VariableValueCodec(dataType)
        valueCodec.baseCodecs = this.baseCodecs

        // FactoryDefaultValue (variable size)
        const factoryDefaultResult = valueCodec.decode(buffer, currentOffset)
        const factoryDefaultValue = factoryDefaultResult.value.value
        currentOffset += factoryDefaultResult.bytesRead

        // CurrentValue (variable size)
        const currentValueResult = valueCodec.decode(buffer, currentOffset)
        const currentValueRaw = currentValueResult.value.value
        const currentValueBytes = currentValueResult.value.rawBytes
        currentOffset += currentValueResult.bytesRead

        // FormFlag (1 byte)
        const formFlagResult = u8.decode(buffer, currentOffset)
        const formFlag = formFlagResult.value
        currentOffset += formFlagResult.bytesRead

        // Look up property name from definitions
        const propertyDef = standardPropertyDefinitions.find(p => p.code === devicePropertyCode)
        const devicePropertyName = propertyDef?.name || `Unknown_0x${devicePropertyCode.toString(16).padStart(4, '0')}`
        const devicePropertyDescription = propertyDef?.description || ''

        // Decode current value using property's codec if available
        let currentValueDecoded = currentValueRaw
        if (propertyDef && propertyDef.codec) {
            const codec = propertyDef.codec as any
            if (codec && typeof codec === 'object') {
                codec.baseCodecs = this.baseCodecs
            }
            const decodedResult = codec.decode(currentValueBytes, 0)
            currentValueDecoded = decodedResult.value
        }

        let minimumValue: any = undefined
        let maximumValue: any = undefined
        let stepSize: any = undefined
        let numberOfValues: number | undefined = undefined
        let supportedValuesRaw: any[] | undefined = undefined
        let supportedValuesDecoded: any[] | undefined = undefined

        // Handle form field based on FormFlag
        if (formFlag === 0x01) {
            // Range form
            const minResult = valueCodec.decode(buffer, currentOffset)
            minimumValue = minResult.value.value
            currentOffset += minResult.bytesRead

            const maxResult = valueCodec.decode(buffer, currentOffset)
            maximumValue = maxResult.value.value
            currentOffset += maxResult.bytesRead

            const stepResult = valueCodec.decode(buffer, currentOffset)
            stepSize = stepResult.value.value
            currentOffset += stepResult.bytesRead

            // Decode range values if codec available
            if (propertyDef && propertyDef.codec) {
                const codec = propertyDef.codec as any
                if (codec && typeof codec === 'object') {
                    codec.baseCodecs = this.baseCodecs
                }

                const datatypeDefinition = getDatatypeByCode(dataType)
                if (datatypeDefinition?.codec) {
                    const datatypeCodec = this.resolveBaseCodec(datatypeDefinition.codec)

                    const minBytes = datatypeCodec.encode(minimumValue)
                    const maxBytes = datatypeCodec.encode(maximumValue)
                    const stepBytes = datatypeCodec.encode(stepSize)

                    minimumValue = codec.decode(minBytes, 0).value
                    maximumValue = codec.decode(maxBytes, 0).value
                    stepSize = codec.decode(stepBytes, 0).value
                }
            }
        } else if (formFlag === 0x02) {
            // Enumeration form
            const numValuesResult = u16.decode(buffer, currentOffset)
            numberOfValues = numValuesResult.value
            currentOffset += numValuesResult.bytesRead

            supportedValuesRaw = []
            for (let i = 0; i < numberOfValues; i++) {
                const enumValueResult = valueCodec.decode(buffer, currentOffset)
                supportedValuesRaw.push(enumValueResult.value.value)
                currentOffset += enumValueResult.bytesRead
            }

            // Decode enum values using property's codec if available
            supportedValuesDecoded = supportedValuesRaw
            if (propertyDef && propertyDef.codec && supportedValuesRaw.length > 0) {
                const codec = propertyDef.codec as any
                if (codec && typeof codec === 'object') {
                    codec.baseCodecs = this.baseCodecs
                }

                const datatypeDefinition = getDatatypeByCode(dataType)
                if (datatypeDefinition?.codec) {
                    const datatypeCodec = this.resolveBaseCodec(datatypeDefinition.codec)

                    supportedValuesDecoded = supportedValuesRaw.map((rawVal: any) => {
                        const bytes = datatypeCodec.encode(rawVal)
                        const decoded = codec.decode(bytes, 0)
                        return decoded.value
                    })
                }
            }
        }

        return {
            value: {
                devicePropertyCode,
                devicePropertyName,
                devicePropertyDescription,
                dataType,
                getSet: getSet === 0x01 ? 'GET_SET' : 'GET',
                factoryDefaultValue,
                currentValueRaw,
                currentValueBytes,
                currentValueDecoded,
                formFlag,
                minimumValue,
                maximumValue,
                stepSize,
                numberOfValues,
                supportedValuesRaw,
                supportedValuesDecoded,
            },
            bytesRead: currentOffset - offset,
        }
    }
}

// Standard codec for 2-byte property codes (ISO standard)
export const devicePropDescCodec = new DevicePropDescCodec(false)

// Extended codec for 4-byte property codes (Nikon extended)
export const devicePropDescCodecEx = new DevicePropDescCodec(true)

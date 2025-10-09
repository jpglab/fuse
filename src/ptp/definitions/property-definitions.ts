import { PropertyDefinition } from '@ptp/types/property'
import { baseCodecs, EnumCodec, CustomCodec } from '@ptp/types/codec'
import { getDatatypeByName } from '@ptp/definitions/datatype-definitions'

const UNDEF = getDatatypeByName('UNDEF')!.code
const UINT8 = getDatatypeByName('UINT8')!.code
const UINT16 = getDatatypeByName('UINT16')!.code
const INT16 = getDatatypeByName('INT16')!.code
const UINT32 = getDatatypeByName('UINT32')!.code
const STRING = getDatatypeByName('STR')!.code

export const propertyDefinitions = [
    {
        code: 0x5000,
        name: 'Undefined',
        description: 'Undefined property',
        datatype: UNDEF,
        access: 'Get',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5001,
        name: 'BatteryLevel',
        description: 'Battery level percentage',
        datatype: UINT8,
        access: 'Get',
        codec: baseCodecs.uint8,
    },
    {
        code: 0x5002,
        name: 'FunctionalMode',
        description: 'Functional mode of device',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5003,
        name: 'ImageSize',
        description: 'Image dimensions',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x5004,
        name: 'CompressionSetting',
        description: 'Compression level',
        datatype: UINT8,
        access: 'GetSet',
        codec: baseCodecs.uint8,
    },
    {
        code: 0x5005,
        name: 'WhiteBalance',
        description: 'White balance setting',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5006,
        name: 'RGBGain',
        description: 'RGB gain values',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x5007,
        name: 'FNumber',
        description: 'F-stop number (aperture)',
        datatype: UINT16,
        access: 'GetSet',
        codec: new (class extends CustomCodec<string> {
            encode(value: string): Uint8Array {
                const uint16 = this.resolveBaseCodec(baseCodecs.uint16)
                // Parse strings like "f/2.8", "2.8", "F2.8"
                const numericValue = parseFloat(value.replace(/[^\d.]/g, ''))
                return uint16.encode(Math.round(numericValue * 100))
            }
            decode(buffer: Uint8Array, offset = 0): { value: string; bytesRead: number } {
                const uint16 = this.resolveBaseCodec(baseCodecs.uint16)
                const result = uint16.decode(buffer, offset)
                const fNumber = result.value / 100
                // Format as f/x.x
                if (fNumber === Math.floor(fNumber)) {
                    return { value: `f/${Math.floor(fNumber)}`, bytesRead: result.bytesRead }
                } else {
                    return { value: `f/${fNumber.toFixed(1)}`, bytesRead: result.bytesRead }
                }
            }
        })(),
    },
    {
        code: 0x5008,
        name: 'FocalLength',
        description: 'Focal length in mm',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5009,
        name: 'FocusDistance',
        description: 'Focus distance in mm',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x500a,
        name: 'FocusMode',
        description: 'Focus mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x500b,
        name: 'ExposureMeteringMode',
        description: 'Exposure metering mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x500c,
        name: 'FlashMode',
        description: 'Flash mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x500d,
        name: 'ExposureTime',
        description: 'Exposure time (shutter speed)',
        datatype: UINT32,
        access: 'GetSet',
        codec: new (class extends CustomCodec<string> {
            encode(value: string): Uint8Array {
                // Parse strings like "1/250", "1.3\"", "BULB"
                const uint32 = this.resolveBaseCodec(baseCodecs.uint32)

                if (value === 'BULB') {
                    return uint32.encode(0xffffffff)
                }

                // Handle fractional format: 1/250
                if (value.includes('/')) {
                    const [num, denom] = value.split('/').map(s => parseInt(s.trim()))
                    const seconds = num / denom
                    return uint32.encode(Math.round(seconds * 10000))
                }

                // Handle seconds format: 1.3" or 1"
                if (value.includes('"')) {
                    const seconds = parseFloat(value.replace('"', ''))
                    return uint32.encode(Math.round(seconds * 10000))
                }

                // Assume raw seconds as number string
                const seconds = parseFloat(value)
                return uint32.encode(Math.round(seconds * 10000))
            }
            decode(buffer: Uint8Array, offset = 0): { value: string; bytesRead: number } {
                const uint32 = this.resolveBaseCodec(baseCodecs.uint32)
                const result = uint32.decode(buffer, offset)
                const rawValue = result.value

                // Handle BULB mode
                if (rawValue === 0xffffffff) {
                    return { value: 'BULB', bytesRead: result.bytesRead }
                }

                // Convert to seconds
                const seconds = rawValue / 10000

                // Format based on value
                if (seconds < 0.3) {
                    // Fast shutter speeds - show as fraction
                    const denominator = Math.round(1 / seconds)
                    return { value: `1/${denominator}`, bytesRead: result.bytesRead }
                } else if (seconds >= 1) {
                    // Slow shutter speeds - show in seconds with quote mark
                    if (seconds === Math.floor(seconds)) {
                        return { value: `${Math.floor(seconds)}"`, bytesRead: result.bytesRead }
                    } else {
                        return { value: `${seconds.toFixed(1)}"`, bytesRead: result.bytesRead }
                    }
                } else {
                    // Medium speeds - show as decimal fraction
                    const denominator = Math.round(1 / seconds)
                    return { value: `1/${denominator}`, bytesRead: result.bytesRead }
                }
            }
        })(),
    },
    {
        code: 0x500e,
        name: 'ExposureProgramMode',
        description: 'Exposure program mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x500f,
        name: 'ExposureIndex',
        description: 'ISO speed',
        datatype: UINT16,
        access: 'GetSet',
        codec: new (class extends CustomCodec<string> {
            encode(value: string): Uint8Array {
                const uint16 = this.resolveBaseCodec(baseCodecs.uint16)
                // Parse strings like "ISO 100", "ISO AUTO", "100", "auto"
                if (value.toLowerCase().includes('auto')) {
                    return uint16.encode(0xffff)
                }
                const numericValue = parseInt(value.replace(/\D/g, ''))
                return uint16.encode(numericValue)
            }
            decode(buffer: Uint8Array, offset = 0): { value: string; bytesRead: number } {
                const uint16 = this.resolveBaseCodec(baseCodecs.uint16)
                const result = uint16.decode(buffer, offset)
                if (result.value === 0xffff) {
                    return { value: 'ISO AUTO', bytesRead: result.bytesRead }
                }
                return { value: `ISO ${result.value}`, bytesRead: result.bytesRead }
            }
        })(),
    },
    {
        code: 0x5010,
        name: 'ExposureBiasCompensation',
        description: 'Exposure bias compensation',
        datatype: INT16,
        access: 'GetSet',
        codec: baseCodecs.int16,
    },
    {
        code: 0x5011,
        name: 'DateTime',
        description: 'Device date and time',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x5012,
        name: 'CaptureDelay',
        description: 'Capture delay in milliseconds',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5013,
        name: 'StillCaptureMode',
        description: 'Still capture mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5014,
        name: 'Contrast',
        description: 'Contrast setting',
        datatype: UINT8,
        access: 'GetSet',
        codec: baseCodecs.uint8,
    },
    {
        code: 0x5015,
        name: 'Sharpness',
        description: 'Sharpness setting',
        datatype: UINT8,
        access: 'GetSet',
        codec: baseCodecs.uint8,
    },
    {
        code: 0x5016,
        name: 'DigitalZoom',
        description: 'Digital zoom factor',
        datatype: UINT8,
        access: 'GetSet',
        codec: baseCodecs.uint8,
    },
    {
        code: 0x5017,
        name: 'EffectMode',
        description: 'Effect mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5018,
        name: 'BurstNumber',
        description: 'Number of burst shots',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5019,
        name: 'BurstInterval',
        description: 'Burst interval in milliseconds',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x501a,
        name: 'TimelapseNumber',
        description: 'Number of timelapse shots',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x501b,
        name: 'TimelapseInterval',
        description: 'Timelapse interval in milliseconds',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x501c,
        name: 'FocusMeteringMode',
        description: 'Focus metering mode',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x501d,
        name: 'UploadURL',
        description: 'Upload URL',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x501e,
        name: 'Artist',
        description: 'Artist name',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x501f,
        name: 'CopyrightInfo',
        description: 'Copyright information',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x5020,
        name: 'SupportedStreams',
        description: 'Supported streams bitmask (PTP v1.1)',
        datatype: UINT32,
        access: 'Get',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5021,
        name: 'EnabledStreams',
        description: 'Enabled streams bitmask (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5022,
        name: 'VideoFormat',
        description: 'Video format (FOURCC code) (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5023,
        name: 'VideoResolution',
        description: 'Video resolution (e.g., "320x240") (PTP v1.1)',
        datatype: STRING,
        access: 'GetSet',
        codec: baseCodecs.string,
    },
    {
        code: 0x5024,
        name: 'VideoQuality',
        description: 'Video quality level (PTP v1.1)',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5025,
        name: 'VideoFrameRate',
        description: 'Video frame interval in microseconds (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5026,
        name: 'VideoContrast',
        description: 'Video contrast level (PTP v1.1)',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5027,
        name: 'VideoBrightness',
        description: 'Video brightness level (PTP v1.1)',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x5028,
        name: 'AudioFormat',
        description: 'Audio format code from RIFF specification (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x5029,
        name: 'AudioBitrate',
        description: 'Audio bitrate in bits per second (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x502a,
        name: 'AudioSamplingRate',
        description: 'Audio sampling rate in hertz (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
    {
        code: 0x502b,
        name: 'AudioBitPerSample',
        description: 'Audio bits per sample (PTP v1.1)',
        datatype: UINT16,
        access: 'GetSet',
        codec: baseCodecs.uint16,
    },
    {
        code: 0x502c,
        name: 'AudioVolume',
        description: 'Audio volume level (PTP v1.1)',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
] as const satisfies readonly PropertyDefinition[]

// Type to extract property names from the actual definitions
export type PropertyName = (typeof propertyDefinitions)[number]['name']

// Type to extract a specific property by name
export type GetProperty<N extends PropertyName> = Extract<(typeof propertyDefinitions)[number], { name: N }>

export const propertiesByCode = new Map(propertyDefinitions.map(prop => [prop.code, prop]))

export const propertiesByName = new Map(propertyDefinitions.map(prop => [prop.name, prop]))

export function getPropertyByCode(code: number): PropertyDefinition | undefined {
    return propertiesByCode.get(code as any) as PropertyDefinition | undefined
}

export function getPropertyByName(name: string): PropertyDefinition | undefined {
    return propertiesByName.get(name as any) as PropertyDefinition | undefined
}

import { CodecDefinition } from '@ptp/types/codec'

export type PropertyAccess = 'Get' | 'GetSet'

export interface PropertyDefinition<T = number | bigint | string> {
    code: number
    name: string
    description: string
    datatype: number
    access: PropertyAccess
    codec: CodecDefinition<T>
    defaultValue?: T
    currentValue?: T
}

export type DevicePropCode = number

export function isStandardPropertyCode(code: number): boolean {
    return (code & 0xf000) === 0x5000
}

export function isVendorPropertyCode(code: number): boolean {
    return (code & 0x8000) === 0x8000 && (code & 0xf000) === 0xd000
}

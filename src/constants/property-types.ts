/**
 * Property type system with validation
 * V7 Architecture - Type-safe with validation
 */

import type { HexCode, DataTypeValue, PropertyFormValue } from '@constants/types'

/**
 * Property descriptor for allowed values
 */
export interface PropertyDescriptor<T> {
  current?: T
  default?: T
  form: PropertyFormValue
  min?: T
  max?: T
  step?: T
  allowedValues?: T[]
}

/**
 * Property definition
 */
export interface Property {
  name: string
  code: HexCode
  type: DataTypeValue
  unit?: string
  description: string
  writable?: boolean
  descriptor?: PropertyDescriptor<any>
  enum?: Record<string, HexCode>
  encode?: (value: any) => HexCode | Uint8Array
  decode?: (value: HexCode | Uint8Array) => any
}

/**
 * Property definition shape for validation
 */
export type PropertyDefinitionShape = Record<string, Property>
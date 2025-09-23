/**
 * Buffer Operations
 * Provides low-level buffer manipulation for PTP protocol data
 */

import { DataType, DataTypeValue } from '@constants/types'

/**
 * Create a DataView from a Uint8Array with proper offset handling
 * @param data - Uint8Array to create DataView from
 * @returns DataView with correct buffer, offset, and length
 */
export function createDataView(data: Uint8Array): DataView {
  return new DataView(data.buffer, data.byteOffset, data.byteLength)
}

/**
 * Convert Uint8Array to Buffer for Node.js compatibility
 * Used primarily in transport layer and API layer for Frame/Photo classes
 * @param data - Uint8Array to convert
 * @returns Buffer
 */
export function toBuffer(data: Uint8Array): Buffer {
  return Buffer.from(data)
}

/**
 * Convert Buffer or any array-like to Uint8Array
 * Used primarily in transport layer for cross-platform compatibility
 * @param data - Buffer or array-like to convert
 * @returns Uint8Array
 */
export function toUint8Array(data: Buffer | ArrayBuffer | ArrayLike<number>): Uint8Array {
  if (data instanceof Uint8Array) {
    return data
  }
  return new Uint8Array(data)
}

/**
 * Encode a value into a buffer based on PTP data type
 */
export function encodePTPValue(value: any, dataType: DataTypeValue): Uint8Array {
  const buffer = new ArrayBuffer(8)
  const uint8Buffer = new Uint8Array(buffer)
  const view = createDataView(uint8Buffer)

  switch (dataType) {
    case DataType.UINT8:
      view.setUint8(0, value)
      return new Uint8Array(buffer, 0, 1)
    case DataType.INT8:
      view.setInt8(0, value)
      return new Uint8Array(buffer, 0, 1)
    case DataType.UINT16:
      view.setUint16(0, value, true)
      return new Uint8Array(buffer, 0, 2)
    case DataType.INT16:
      view.setInt16(0, value, true)
      return new Uint8Array(buffer, 0, 2)
    case DataType.UINT32:
      view.setUint32(0, value, true)
      return new Uint8Array(buffer, 0, 4)
    case DataType.INT32:
      view.setInt32(0, value, true)
      return new Uint8Array(buffer, 0, 4)
    case DataType.STRING:
      const encoder = new TextEncoder()
      const utf8 = encoder.encode(value)
      const result = new Uint8Array(2 + utf8.length)
      result[0] = utf8.length
      result[1] = 0
      result.set(utf8, 2)
      return result
    default:
      return new Uint8Array()
  }
}

/**
 * Decode a value from a buffer based on PTP data type
 */
export function decodePTPValue(data: Uint8Array, dataType: DataTypeValue): any {
  if (!data || data.length === 0) return null

  const view = createDataView(data)

  switch (dataType) {
    case DataType.UINT8:
      return view.getUint8(0)
    case DataType.INT8:
      return view.getInt8(0)
    case DataType.UINT16:
      return view.getUint16(0, true)
    case DataType.INT16:
      return view.getInt16(0, true)
    case DataType.UINT32:
      return view.getUint32(0, true)
    case DataType.INT32:
      return view.getInt32(0, true)
    case DataType.STRING:
      const length = view.getUint16(0, true)
      const decoder = new TextDecoder()
      return decoder.decode(sliceBuffer(data, 2, 2 + length))
    default:
      return data
  }
}

/**
 * Find a byte sequence in a buffer
 * @param buffer - Buffer to search in
 * @param sequence - Byte sequence to find
 * @param start - Starting offset (default: 0)
 * @returns Index of first match or -1 if not found
 */
export function findByteSequence(buffer: Uint8Array, sequence: readonly number[], start = 0): number {
  for (let i = start; i <= buffer.length - sequence.length; i++) {
    let found = true
    for (let j = 0; j < sequence.length; j++) {
      if (buffer[i + j] !== sequence[j]) {
        found = false
        break
      }
    }
    if (found) return i
  }
  return -1
}

/**
 * Slice a Uint8Array with options for copying or creating a view
 * @param data - Source Uint8Array
 * @param start - Starting offset in the source array
 * @param end - Ending offset or length (depending on copy mode)
 * @param options - { copy: boolean } - Whether to copy data (default: true)
 * @returns New Uint8Array (copy or view based on options)
 */
export function sliceBuffer(data: Uint8Array, start: number, end?: number, options: { copy?: boolean } = { copy: true }): Uint8Array {
  if (options.copy !== false) {
    // Copy mode (default) - end is the ending offset
    return new Uint8Array(data.slice(start, end))
  } else {
    // View mode - end is the length
    const length = end !== undefined ? end : data.byteLength - start
    return new Uint8Array(data.buffer, data.byteOffset + start, length)
  }
}

/**
 * @deprecated Use sliceBuffer with { copy: false } option instead
 */
export function viewSlice(data: Uint8Array, offset: number, length: number): Uint8Array {
  return sliceBuffer(data, offset, length, { copy: false })
}

/**
 * @deprecated Use sliceBuffer with { copy: true } option instead
 */
export function copySlice(data: Uint8Array, start: number, end?: number): Uint8Array {
  return sliceBuffer(data, start, end, { copy: true })
}


/**
 * Parse a PTP array of UINT32 values
 * PTP arrays are formatted as: [count:uint32][value1:uint32][value2:uint32]...
 * @param data - Buffer containing the array
 * @param offset - Starting offset in the buffer (default: 0)
 * @returns Array of parsed values
 */
export function parsePTPUint32Array(data: Uint8Array, offset = 0): number[] {
  if (data.length < offset + 4) return []
  
  const view = createDataView(data)
  const count = view.getUint32(offset, true)
  const values: number[] = []
  
  // Ensure we don't read beyond buffer bounds
  const maxItems = Math.min(count, Math.floor((data.length - offset - 4) / 4))
  
  for (let i = 0; i < maxItems; i++) {
    values.push(view.getUint32(offset + 4 + i * 4, true))
  }
  
  return values
}

/**
 * Get the size in bytes of a PTP data type value
 * For fixed-size types, returns the size directly
 * For variable-size types like STRING, reads the size from the data
 * @param dataType - The PTP data type
 * @param data - The data buffer (required for variable-size types)
 * @returns Size in bytes
 */
export function getPTPValueSize(dataType: DataTypeValue, data?: Uint8Array): number {
  switch (dataType) {
    case DataType.UINT8:
    case DataType.INT8:
      return 1
    case DataType.UINT16:
    case DataType.INT16:
      return 2
    case DataType.UINT32:
    case DataType.INT32:
      return 4
    case DataType.UINT64:
    case DataType.INT64:
      return 8
    case DataType.STRING:
      if (!data || data.length < 2) return 0
      const view = createDataView(data)
      const length = view.getUint16(0, true)
      return 2 + length
    default:
      return 0
  }
}


/**
 * Error classes for PTP protocol and camera operations
 */

import { HexCode } from '@constants/types'

/**
 * PTP Error class for protocol errors
 */
export class PTPError extends Error {
    constructor(
        public readonly code: HexCode,
        message: string,
        public readonly operation?: string
    ) {
        super(message)
        this.name = 'PTPError'
    }
}

/**
 * Sony-specific format codes
 */

import { FormatDefinition } from '@constants/types'
import { PTPFormats } from '@constants/ptp/formats'

export const SonyFormats = {
    ...PTPFormats,

    // Sony-specific formats
    RAW: {
        name: 'RAW',
        code: 0xb101,
        type: 'I',
        description: 'For RAW File',
        fileExtension: '.arw',
    },

    HEIF: {
        name: 'HEIF',
        code: 0xb110,
        type: 'I',
        description: 'For HEIF File',
        fileExtension: '.heif',
    },

    MPO: {
        name: 'MPO',
        code: 0xb301,
        type: 'I',
        description: 'For MPO File',
        fileExtension: '.mpo',
    },
} as const satisfies FormatDefinition

export type SonyFormatDefinitions = typeof SonyFormats

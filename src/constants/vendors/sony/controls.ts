/**
 * Sony hardware controls with type validation
 */

import { ControlDefinition } from '@constants/types'

/**
 * Sony hardware controls with type validation
 */
export const SonyControls = {
  // Shutter button controls
  SHUTTER_HALF_PRESS: {
    property: 0xD2C1,
    value: 0x0002,
    description: 'Half-press shutter button (focus)',
  },
  SHUTTER_FULL_PRESS: {
    property: 0xD2C1,
    value: 0x0001,
    description: 'Full-press shutter button (capture)',
  },
  SHUTTER_RELEASE: {
    property: 0xD2C1,
    value: 0x0000,
    description: 'Release shutter button',
  },
  
  // Focus button controls
  FOCUS_HALF_PRESS: {
    property: 0xD2C2,
    value: 0x0002,
    description: 'Start autofocus',
  },
  FOCUS_FULL_PRESS: {
    property: 0xD2C2,
    value: 0x0001,
    description: 'Lock focus',
  },
  FOCUS_RELEASE: {
    property: 0xD2C2,
    value: 0x0000,
    description: 'Release focus button',
  },
  
  // Zoom controls
  ZOOM_IN_START: {
    property: 0xD2D2,
    value: 0x0001,
    description: 'Start zooming in',
  },
  ZOOM_IN_STOP: {
    property: 0xD2D2,
    value: 0x0000,
    description: 'Stop zooming in',
  },
  ZOOM_OUT_START: {
    property: 0xD2D3,
    value: 0x0001,
    description: 'Start zooming out',
  },
  ZOOM_OUT_STOP: {
    property: 0xD2D3,
    value: 0x0000,
    description: 'Stop zooming out',
  },
  
  // Live view controls
  LIVE_VIEW_ENABLE: {
    property: 0xD313,
    value: 0x0002,
    description: 'Enable live view mode',
  },
  LIVE_VIEW_DISABLE: {
    property: 0xD313,
    value: 0x0001,
    description: 'Disable live view mode',
  }
} as const satisfies ControlDefinition

export type SonyControlDefinitions = typeof SonyControls
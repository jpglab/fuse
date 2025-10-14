import { EventDefinition } from '@ptp/types/event'

export const SDIE_ObjectAdded = {
    code: 0xc201,
    name: 'SDIE_ObjectAdded',
    description: 'Notify that a shot file is ready to transfer',
    parameters: [{ name: 'ObjectHandle', description: 'Handle of the added object', type: 'ObjectHandle' }],
} as const satisfies EventDefinition

export const SDIE_ObjectRemoved = {
    code: 0xc202,
    name: 'SDIE_ObjectRemoved',
    description: 'Notify that a shot file is deleted',
    parameters: [{ name: 'ObjectHandle', description: 'Handle of the removed object', type: 'ObjectHandle' }],
} as const satisfies EventDefinition

export const SDIE_DevicePropChanged = {
    code: 0xc203,
    name: 'SDIE_DevicePropChanged',
    description: 'Notify that the DevicePropValue is changed',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_DateTimeSettingResult = {
    code: 0xc205,
    name: 'SDIE_DateTimeSettingResult',
    description: 'Notify Date/Time Setting result',
    parameters: [{ name: 'Setting Result', description: 'Date/Time setting result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_CapturedEvent = {
    code: 0xc206,
    name: 'SDIE_CapturedEvent',
    description: 'Notify a captured event',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_CWBCapturedResult = {
    code: 0xc208,
    name: 'SDIE_CWBCapturedResult',
    description: 'Notify the result of Custom WB capture',
    parameters: [{ name: 'Result', description: 'Custom WB capture result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_CameraSettingReadResult = {
    code: 0xc209,
    name: 'SDIE_CameraSettingReadResult',
    description: 'Notify the result of camera-setting read',
    parameters: [{ name: 'Result', description: 'Camera setting read result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_FTPSettingReadResult = {
    code: 0xc20a,
    name: 'SDIE_FTPSettingReadResult',
    description: 'Notify the result of FTP-setting read',
    parameters: [{ name: 'Result', description: 'FTP setting read result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_MediaFormatResult = {
    code: 0xc20b,
    name: 'SDIE_MediaFormatResult',
    description: 'Notify the result of media format',
    parameters: [{ name: 'Result', description: 'Media format result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_ContentsTransferEvent = {
    code: 0xc20d,
    name: 'SDIE_ContentsTransferEvent',
    description: 'Notify that the ContentTransferEvent',
    parameters: [{ name: 'Event ID', description: 'Contents transfer event ID', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_ZoomandFocusPositionEvent = {
    code: 0xc20e,
    name: 'SDIE_ZoomandFocusPositionEvent',
    description: 'Notify the Zoom and Focus Position Event',
    parameters: [{ name: 'Event ID', description: 'Zoom and focus position event ID', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_DisplayListChangedEvent = {
    code: 0xc20f,
    name: 'SDIE_DisplayListChangedEvent',
    description: 'Notify an update of DisplayStringList',
    parameters: [{ name: 'Display String List Type', description: 'Display string list type', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_MediaProfileChanged = {
    code: 0xc210,
    name: 'SDIE_MediaProfileChanged',
    description: 'Notify that the media profile is changed',
    parameters: [{ name: 'Media', description: 'Media identifier', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_ControlJobListEvent = {
    code: 0xc211,
    name: 'SDIE_ControlJobListEvent',
    description: 'Notify the Control Job List Event',
    parameters: [
        { name: 'Result', description: 'Control job list result code', type: 'UINT32' },
        { name: 'ControlType', description: 'Control type', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_ControlUploadDataResultOld = {
    code: 0xc213,
    name: 'SDIE_ControlUploadDataResultOld',
    description: 'Notify the result of ControlUpload (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_ControlUploadDataResult = {
    code: 0xc214,
    name: 'SDIE_ControlUploadDataResult',
    description: 'Notify the result of ControlUpload',
    parameters: [
        { name: 'Result', description: 'Control upload result code', type: 'UINT32' },
        { name: 'ControlType', description: 'Control type', type: 'UINT32' },
        { name: 'OptionParam', description: 'Optional parameter', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_ZoomPositionResultOld = {
    code: 0xc216,
    name: 'SDIE_ZoomPositionResultOld',
    description: 'Notify the zoom position result (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_ZoomPositionResult = {
    code: 0xc217,
    name: 'SDIE_ZoomPositionResult',
    description: 'Notify the zoom position result',
    parameters: [{ name: 'Result', description: 'Zoom position result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_FocusPositionResult = {
    code: 0xc218,
    name: 'SDIE_FocusPositionResult',
    description: 'Notify the focus position result',
    parameters: [{ name: 'Result', description: 'Focus position result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_LensInformationChangedOld = {
    code: 0xc219,
    name: 'SDIE_LensInformationChangedOld',
    description: 'Notify that the lens information is changed (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_FirmwareUpdateCheckResultOld = {
    code: 0xc21a,
    name: 'SDIE_FirmwareUpdateCheckResultOld',
    description: 'Firmware update check result (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_LensInformationChanged = {
    code: 0xc21b,
    name: 'SDIE_LensInformationChanged',
    description: 'Notify that the lens information is changed',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_FirmwareUpdateEventOld = {
    code: 0xc21c,
    name: 'SDIE_FirmwareUpdateEventOld',
    description: 'Firmware update event (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_FirmwareUpdateCheckResult = {
    code: 0xc21d,
    name: 'SDIE_FirmwareUpdateCheckResult',
    description: 'Firmware update check result',
    parameters: [{ name: 'Result', description: 'Firmware update check result code', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_FirmwareUpdateEvent = {
    code: 0xc21e,
    name: 'SDIE_FirmwareUpdateEvent',
    description: 'Firmware update event',
    parameters: [
        { name: 'Event ID', description: 'Firmware update event ID', type: 'UINT32' },
        { name: 'Param1', description: 'Event parameter 1', type: 'UINT32' },
        { name: 'Param2', description: 'Event parameter 2', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_StreamStatusEvent = {
    code: 0xc21f,
    name: 'SDIE_StreamStatusEvent',
    description: 'Notify the stream status event',
    parameters: [
        { name: 'Stream ID', description: 'Stream identifier', type: 'UINT32' },
        { name: 'Status', description: 'Stream status', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_OperationResultsOld = {
    code: 0xc220,
    name: 'SDIE_OperationResultsOld',
    description: 'Notify the operation results (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_AFStatusOld = {
    code: 0xc221,
    name: 'SDIE_AFStatusOld',
    description: 'Notify the AF status (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_OperationResults = {
    code: 0xc222,
    name: 'SDIE_OperationResults',
    description: 'Notify the operation results',
    parameters: [
        { name: 'ResultCode', description: 'Operation result code', type: 'UINT32' },
        { name: 'Result', description: 'Result value', type: 'UINT32' },
        { name: 'Reserved', description: 'Reserved parameter', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_AFStatus = {
    code: 0xc223,
    name: 'SDIE_AFStatus',
    description: 'Notify the AF status',
    parameters: [{ name: 'Status', description: 'Autofocus status', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_MovieRecOperationResults = {
    code: 0xc224,
    name: 'SDIE_MovieRecOperationResults',
    description: 'Notify the execution results of Movie Rec Operation',
    parameters: [{ name: 'Results', description: 'Movie recording operation results', type: 'UINT32' }],
} as const satisfies EventDefinition

export const SDIE_PresetInfoListChangedOld = {
    code: 0xc225,
    name: 'SDIE_PresetInfoListChangedOld',
    description: 'Notify that the PresetInfo List is changed (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_PresetInfoListChanged = {
    code: 0xc226,
    name: 'SDIE_PresetInfoListChanged',
    description: 'Notify that the PresetInfo List is changed',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_CautionDisplayEventOld = {
    code: 0xc227,
    name: 'SDIE_CautionDisplayEventOld',
    description: 'Notify the CautionDisplayEvent (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_CautionDisplayEvent = {
    code: 0xc228,
    name: 'SDIE_CautionDisplayEvent',
    description: 'Notify the CautionDisplayEvent',
    parameters: [
        { name: 'Reserve', description: 'Reserved parameter 1', type: 'UINT32' },
        { name: 'Reserve', description: 'Reserved parameter 2', type: 'UINT32' },
        { name: 'Reserve', description: 'Reserved parameter 3', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_ContentInfoListChangedOld = {
    code: 0xc229,
    name: 'SDIE_ContentInfoListChangedOld',
    description: 'Notify that the ContentInfo List is changed (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_ContentInfoListChanged = {
    code: 0xc234,
    name: 'SDIE_ContentInfoListChanged',
    description: 'Notify that the ContentInfo List is changed',
    parameters: [
        { name: 'Slot Info', description: 'Slot information', type: 'UINT32' },
        { name: 'Event Type', description: 'Event type', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_ControlPTZFResultOld = {
    code: 0xc235,
    name: 'SDIE_ControlPTZFResultOld',
    description: 'Notify the ControlPTZF result (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_PresetPTZFEventOld = {
    code: 0xc237,
    name: 'SDIE_PresetPTZFEventOld',
    description: 'Notify the PresetPTZF Event (older version)',
    parameters: [],
} as const satisfies EventDefinition

export const SDIE_ControlPTZFResult = {
    code: 0xc238,
    name: 'SDIE_ControlPTZFResult',
    description: 'Notify the ControlPTZF result',
    parameters: [
        { name: 'Result', description: 'Control PTZF result code', type: 'UINT32' },
        { name: 'Control Type', description: 'Control type', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_PresetPTZFEvent = {
    code: 0xc239,
    name: 'SDIE_PresetPTZFEvent',
    description: 'Notify the PresetPTZF Event',
    parameters: [
        { name: 'Event Type', description: 'Event type', type: 'UINT32' },
        { name: 'Reserved', description: 'Reserved parameter 1', type: 'UINT32' },
        { name: 'Reserved', description: 'Reserved parameter 2', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const SDIE_DeleteContentResult = {
    code: 0xc240,
    name: 'SDIE_DeleteContentResult',
    description: 'Notify the DeleteContentResult',
    parameters: [
        { name: 'Result', description: 'Delete content result code', type: 'UINT32' },
        { name: 'contentID', description: 'Content identifier', type: 'UINT32' },
        { name: 'Slot Info', description: 'Slot information', type: 'UINT32' },
    ],
} as const satisfies EventDefinition

export const sonyEventRegistry = {
    SDIE_ObjectAdded,
    SDIE_ObjectRemoved,
    SDIE_DevicePropChanged,
    SDIE_DateTimeSettingResult,
    SDIE_CapturedEvent,
    SDIE_CWBCapturedResult,
    SDIE_CameraSettingReadResult,
    SDIE_FTPSettingReadResult,
    SDIE_MediaFormatResult,
    SDIE_ContentsTransferEvent,
    SDIE_ZoomandFocusPositionEvent,
    SDIE_DisplayListChangedEvent,
    SDIE_MediaProfileChanged,
    SDIE_ControlJobListEvent,
    SDIE_ControlUploadDataResultOld,
    SDIE_ControlUploadDataResult,
    SDIE_ZoomPositionResultOld,
    SDIE_ZoomPositionResult,
    SDIE_FocusPositionResult,
    SDIE_LensInformationChangedOld,
    SDIE_FirmwareUpdateCheckResultOld,
    SDIE_LensInformationChanged,
    SDIE_FirmwareUpdateEventOld,
    SDIE_FirmwareUpdateCheckResult,
    SDIE_FirmwareUpdateEvent,
    SDIE_StreamStatusEvent,
    SDIE_OperationResultsOld,
    SDIE_AFStatusOld,
    SDIE_OperationResults,
    SDIE_AFStatus,
    SDIE_MovieRecOperationResults,
    SDIE_PresetInfoListChangedOld,
    SDIE_PresetInfoListChanged,
    SDIE_CautionDisplayEventOld,
    SDIE_CautionDisplayEvent,
    SDIE_ContentInfoListChangedOld,
    SDIE_ContentInfoListChanged,
    SDIE_ControlPTZFResultOld,
    SDIE_PresetPTZFEventOld,
    SDIE_ControlPTZFResult,
    SDIE_PresetPTZFEvent,
    SDIE_DeleteContentResult,
} as const

export type SonyEventDef = (typeof sonyEventRegistry)[keyof typeof sonyEventRegistry]

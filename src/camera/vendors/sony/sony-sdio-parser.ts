import { extractSDIOStreamJPEG } from '@camera/vendors/sony/sony-image-utils'
import { parseJPEGDimensions } from '@core/images'
import { createDataView, sliceBuffer } from '@core/buffers'
import { DataTypeValue, HexCode } from '@constants/types'

/**
 * SDIExtDevicePropInfo Dataset
 *
 * | Field                 | Field Order | Size (Bytes) | Datatype |
 * | --------------------- | ----------- | ------------ | -------- |
 * | Device Property Code  | 1           | 2            | UINT16   |
 * | DataType              | 2           | 2            | UINT16   |
 * | GetSet                | 3           | 1            | UINT8    |
 * | IsEnabled             | 4           | 1            | UINT8    |
 * | Factory Default Value | 5           | Variable     | Any      |
 * | Current Value         | 6           | Variable     | Any      |
 * | Form Flag             | 7           | 1            | UINT8    |
 *
 * The GetSet field is defined as the following:
 *
 * -   0x00: The Initiator cannot set the value
 * -   0x01: The Initiator can set the value
 *
 * The IsEnabled field is defined as the following (for the Initiator UI):
 *
 * -   0x00: False (means invalid, greyed-out, no indication for the button, combo box, some values like shutter speed, F-number)
 * -   0x01: True (means valid, indication for the button, combo box, some values like shutter speed, Fnumber)
 * -   0x02: DispOnly (means only indication; cannot change the value)
 *
 * If IsEnabled is "False", the Factory Default Value and Current Value are not guaranteed.
 *
 * If Form Flag is 0x02 (Enumeration), the Dataset will be the following example:
 *
 * | Field                                                     | Field Order | Size (Bytes)        | Datatype |
 * | --------------------------------------------------------- | ----------- | ------------------- | -------- |
 * | Device Property Code                                      | 1           | 2                   | UINT16   |
 * | DataType                                                  | 2           | 2                   | UINT16   |
 * | GetSet                                                    | 3           | 1                   | UINT8    |
 * | IsEnabled                                                 | 4           | 1                   | UINT8    |
 * | Factory Default Value                                     | 5           | Variable            | Any      |
 * | Current Value                                             | 6           | Variable            | Any      |
 * | Form Flag                                                 | 7           | 1                   | UINT8    |
 * | Num of Enum lists (Set)                                   | 8           | 2                   | UINT16   |
 * | Enum value (Set)[0]                                       | 9           | Depends on DataType | -        |
 * | …                                                         | …           | Depends on DataType | -        |
 * | Enum value (Set)<br>[Num of Enum lists (Set) - 1]         | N           | Depends on DataType | -        |
 * | Num of Enum lists(Get/Set)                                | N+1         | 2                   | UINT16   |
 * | Enum value (Get/Set)[0]                                   | N+2         | Depends on DataType | -        |
 * | …                                                         | …           | Depends on DataType | -        |
 * | Enum value (Get/Set)<br>[Num of Enum lists (Get/Set) - 1] | O           | Depends on DataType | -        |
 */

export type SDIExtDevicePropInfo = {
    devicePropertyCode: HexCode // DataType.UINT16
    dataType: HexCode // DataType.UINT16
    getSet: HexCode // DataType.UINT8
    isEnabled: HexCode // DataType.UINT8
    factoryDefaultValue: any // Any
    currentValue: any // Any
    formFlag: HexCode // DataType.UINT8
}

export type SDIExtDevicePropInfoParsed = {
    devicePropertyCode: HexCode
    devicePropertyName: string
    devicePropertyDescription: string
    dataType: DataTypeValue
    writable: boolean
    enabled: boolean
    factoryDefaultValue: any
    currentValue: any
    formFlag: HexCode
    enumValuesSet: any[]
    enumValuesGetSet: any[]
}

export const parseSDIExtDevicePropInfo = (data: Uint8Array): SDIExtDevicePropInfoParsed => {
    // TODO
}

/** SDIDevicePropInfo Dataset Array
 *
 * | Field                                          | Field Order | Size (Bytes) | Datatype |
 * | ---------------------------------------------- | ----------- | ------------ | -------- |
 * | Num of Elements                                | 1           | 8            | UINT64   |
 * | SDIDevicePropInfo Dataset[0]                   | 2           | variable     | UINT16   |
 * | …                                              | …           | variable     | UINT8    |
 * | SDIDevicePropInfo Dataset[Num of Elements - 1] | N           | variable     | UINT8    |
 *
 * Note:
 * Flag of get only difference data:
 * 0x00000000: Gets all data
 * 0x00000001: Gets only difference data
 * Flag of Device Property Option:
 * 0x00000001: Enables extended SDIO Device Property / SDIControlCode
 *
 * The extended SDIO Device Property / SDIControlCode can be used if the camera supports
 * SDIO_GetVendorCodeVersion and the Vendor code version is 3.10 or higher.
 * Please set this flag to utilize all commands supported by the camera. The extended SDIO Device Property
 * uses 0xE000 ~ 0xEFFF, and the SDIControlCode uses 0xF000 ~ 0xFFFF.
 */

export type SDIDevicePropInfo = {
    numOfElements: HexCode // DataType.UINT64
    sdiDevicePropInfoDataset: SDIExtDevicePropInfo[]
}

export type SDIDevicePropInfoParsed = {
    numOfElements: HexCode
    sdiDevicePropInfoDataset: SDIExtDevicePropInfoParsed[]
}

export const parseSDIDevicePropInfoArray = (data: Uint8Array): SDIDevicePropInfoParsed => {
    // TODO
}

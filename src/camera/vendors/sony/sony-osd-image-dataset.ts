import { createDataView, sliceBuffer } from '@core/buffers'

/*
 * OSD Image Dataset
 *
 * | Field                      | Field Order | Size (Bytes)          | Datatype |
 * | -------------------------- | ----------- | --------------------- | -------- |
 * | Offset to OSDImage         | 1           | 4                     | UNIT32   |
 * | OSD Image Size             | 2           | 4                     | UINT32   |
 * | Offset to OSDImageMetaInfo | 3           | 4                     | UNIT32   |
 * | OSDImageMetaInfo Size      | 4           | 4                     | UINT32   |
 * | Reserved                   | 5           | Variable              | UINT8    |
 * | OSDImage Binary            | 6           | OSDImage Size         | UINT8    |
 * | OSDImageMetaInfo           | 7           | OSDImageMetaInfo Size | UINT8    |
 *
 * Note: The image data of the OSD displayed on the camera is obtained as an OSDImage Binary. The data format of the OSDImage Binary is PNG. To obtain the OSDImage Binary, the device property OSD Image Mode must be turned "ON."
 */

export type OSDImageMetaInfo = {
    // The actual structure of OSDImageMetaInfo would need to be defined based on Sony's documentation
    // For now, we'll treat it as raw data
    data: Uint8Array
}

export type OSDImageDataset = {
    offsetToOSDImage: number
    osdImageSize: number
    offsetToOSDImageMetaInfo: number
    osdImageMetaInfoSize: number
    reserved: Uint8Array
    osdImage: Uint8Array | null
    osdImageMetaInfo: OSDImageMetaInfo | null
}

export const parseOSDImageDataset = (data: Uint8Array): OSDImageDataset => {
    const view = createDataView(data)

    // 1. Offset to OSDImage (UINT32)
    const offsetToOSDImage = view.getUint32(0, true)

    // 2. OSD Image Size (UINT32)
    const osdImageSize = view.getUint32(4, true)

    // 3. Offset to OSDImageMetaInfo (UINT32)
    const offsetToOSDImageMetaInfo = view.getUint32(8, true)

    // 4. OSDImageMetaInfo Size (UINT32)
    const osdImageMetaInfoSize = view.getUint32(12, true)

    // 5. Reserved (Variable size - from byte 16 to start of data)
    // Calculate the reserved section size
    const minOffset = Math.min(
        offsetToOSDImage > 0 ? offsetToOSDImage : Infinity,
        offsetToOSDImageMetaInfo > 0 ? offsetToOSDImageMetaInfo : Infinity
    )
    const reservedSize = minOffset > 16 && minOffset !== Infinity ? minOffset - 16 : 0
    const reserved = reservedSize > 0 ? sliceBuffer(data, 16, 16 + reservedSize) : new Uint8Array()

    // 6. OSDImage Binary (PNG data)
    let osdImage: Uint8Array | null = null
    if (
        offsetToOSDImage > 0 &&
        osdImageSize > 0 &&
        data.length >= offsetToOSDImage + osdImageSize
    ) {
        osdImage = sliceBuffer(data, offsetToOSDImage, offsetToOSDImage + osdImageSize)
    }

    // 7. OSDImageMetaInfo
    let osdImageMetaInfo: OSDImageMetaInfo | null = null
    if (
        offsetToOSDImageMetaInfo > 0 &&
        osdImageMetaInfoSize > 0 &&
        data.length >= offsetToOSDImageMetaInfo + osdImageMetaInfoSize
    ) {
        const metaInfoData = sliceBuffer(data, offsetToOSDImageMetaInfo, offsetToOSDImageMetaInfo + osdImageMetaInfoSize)
        osdImageMetaInfo = {
            data: metaInfoData,
        }
    }

    return {
        offsetToOSDImage,
        osdImageSize,
        offsetToOSDImageMetaInfo,
        osdImageMetaInfoSize,
        reserved,
        osdImage,
        osdImageMetaInfo,
    }
}

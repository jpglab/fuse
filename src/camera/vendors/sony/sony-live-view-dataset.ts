import { createDataView, sliceBuffer } from '@core/buffers'

/** LiveView Dataset (ObjectHandle 0xFFFFC002)
 * Shot Image and ObjectInfo Dataset (ObjectHandle 0xFFFFC0003)
 *
* | Field                      | Field Order | Size (Bytes)          | Datatype       |
* | -------------------------- | ----------- | --------------------- | -------------- |
* | Offset to Live View Image  | 1           | 4                     | UINT32         |
* | Live View Image Size       | 2           | 4                     | UINT32         |
* | Offset to Focal Frame Info | 3           | 4                     | UINT32         |
* | Focal Frame Info Size      | 4           | 4                     | UINT32         |
* | Reserved                   | 5           | Variable              | UINT8          |
* | Live View Image            | 6           | Live View Image Size  | (JPEG data)    |
* | Focal Frame Info           | 7           | Focal Frame Info Size | FocalFrameInfo |

* Note: The maximum number of live view fps (frames per second) is 30. Therefore, the Initiator should not use this operation over two times within 33 msec. If the Initiator gets the offset to the live-view image, the live-view image size will be zero in the data phase, and Access_Denied (0x200F) in the response phase, the host should retry this command to obtain the next live view image.
*/

export type FocalFrameInfo = {
    // The actual structure of FocalFrameInfo would need to be defined based on Sony's documentation
    // For now, we'll treat it as raw data
    data: Uint8Array
}

export type LiveViewDataset = {
    offsetToLiveViewImage: number
    liveViewImageSize: number
    offsetToFocalFrameInfo: number
    focalFrameInfoSize: number
    reserved: Uint8Array
    liveViewImage: Uint8Array | null
    focalFrameInfo: FocalFrameInfo | null
}

export const parseLiveViewDataset = (data: Uint8Array): LiveViewDataset => {
    const view = createDataView(data)

    // 1. Offset to Live View Image (UINT32)
    const offsetToLiveViewImage = view.getUint32(0, true)

    // 2. Live View Image Size (UINT32)
    const liveViewImageSize = view.getUint32(4, true)

    // 3. Offset to Focal Frame Info (UINT32)
    const offsetToFocalFrameInfo = view.getUint32(8, true)

    // 4. Focal Frame Info Size (UINT32)
    const focalFrameInfoSize = view.getUint32(12, true)

    // 5. Reserved (Variable size - from byte 16 to start of data)
    // Calculate the reserved section size
    const minOffset = Math.min(
        offsetToLiveViewImage > 0 ? offsetToLiveViewImage : Infinity,
        offsetToFocalFrameInfo > 0 ? offsetToFocalFrameInfo : Infinity
    )
    const reservedSize = minOffset > 16 && minOffset !== Infinity ? minOffset - 16 : 0
    const reserved = reservedSize > 0 ? sliceBuffer(data, 16, 16 + reservedSize) : new Uint8Array()

    // 6. Live View Image (JPEG data)
    let liveViewImage: Uint8Array | null = null
    if (
        offsetToLiveViewImage > 0 &&
        liveViewImageSize > 0 &&
        data.length >= offsetToLiveViewImage + liveViewImageSize
    ) {
        liveViewImage = sliceBuffer(data, offsetToLiveViewImage, offsetToLiveViewImage + liveViewImageSize)
    }

    // 7. Focal Frame Info
    let focalFrameInfo: FocalFrameInfo | null = null
    if (
        offsetToFocalFrameInfo > 0 &&
        focalFrameInfoSize > 0 &&
        data.length >= offsetToFocalFrameInfo + focalFrameInfoSize
    ) {
        const focalFrameData = sliceBuffer(data, offsetToFocalFrameInfo, offsetToFocalFrameInfo + focalFrameInfoSize)
        focalFrameInfo = {
            data: focalFrameData,
        }
    }

    return {
        offsetToLiveViewImage,
        liveViewImageSize,
        offsetToFocalFrameInfo,
        focalFrameInfoSize,
        reserved,
        liveViewImage,
        focalFrameInfo,
    }
}

import { createDataView, sliceBuffer, decodePTPValue } from '@core/buffers'
import { DataType, HexCode } from '@constants/types'
import { PTPFormats } from '@constants/ptp/formats'

/** 5.5.3 ObjectInfo data set
 *
 * This data set is used to define the information about data objects in persistent storage, as well as optional information if the data are known to be an image or an association object. It is required that these data items be accounted for in response to a GetObjectInfo operation. If the data are not known to be an image, or the image information is unavailable, the image-specific fields shall be set to zero. Objects of type Association are fully qualified by the ObjectInfo data set. See Table 9.
 *
 * Table 9 — ObjectInfo data set
 *
 * | Dataset field        | Field<br>order | Size (bytes) | Data type        | Image specific | Association specific |
 * | -------------------- | -------------- | ------------ | ---------------- | -------------- | -------------------- |
 * | StorageID            | 1              | 4            | StorageID        | No             | No                   |
 * | ObjectFormat         | 2              | 2            | ObjectFormatCode | No             | No                   |
 * | ProtectionStatus     | 3              | 2            | UINT16           | No             | No                   |
 * | ObjectCompressedSize | 4              | 4            | UINT32           | No             | No                   |
 * | ThumbFormat          | 5              | 2            | ObjectFormatCode | Yes            | No                   |
 * | ThumbCompressedSize  | 6              | 4            | UINT32           | Yes            | No                   |
 * | ThumbPixWidth        | 7              | 4            | UINT32           | Yes            | No                   |
 * | ThumbPixHeight       | 8              | 4            | UINT32           | Yes            | No                   |
 * | ImagePixWidth        | 9              | 4            | UINT32           | Yes            | No                   |
 * | ImagePixHeight       | 10             | 4            | UINT32           | Yes            | No                   |
 * | ImageBitDepth        | 11             | 4            | UINT32           | Yes            | No                   |
 * | ParentObject         | 12             | 4            | ObjectHandle     | No             | No                   |
 * | AssociationType      | 13             | 2            | AssociationCode  | No             | Yes                  |
 * | AssociationDesc      | 14             | 4            | AssociationDesc  | No             | Yes                  |
 * | SequenceNumber       | 15             | 4            | UINT32           | No             | No                   |
 * | Filename             | 16             | Variable     | String           | No             | No                   |
 * | CaptureDate          | 17             | Variable     | DateTime String  | No             | No                   |
 * | ModificationDate     | 18             | Variable     | DateTime String  | No             | No                   |
 * | Keywords             | 19             | Variable     | String           | No             | No                   |
 *
 * StorageID: the StorageID of the device's store in which the image resides. See <u>8.1</u> for a description of StorageIDs.
 * ObjectFormat: indicates ObjectFormatCode of the object. See 6.3 for a list of these codes.
 * ObjectCompressedSize: the size of the buffer, in bytes, needed to hold the entire binary object. This field may be used by transport implementations for memory allocation purposes in object receivers.
 * ProtectionStatus: an optional field representing the write-protection status of the data object. Objects that are protected may not be deleted as the result of any operations specified in this International Standard without first separately removing their protection status in a separate transaction. The values are enumerated according to <u>Table 10</u>.
 *
 * Table 10 — ObjectInfo ProtectionStatus values
 *
 * | Value            | Description   |
 * | ---------------- | ------------- |
 * | 0x0000           | No protection |
 * | 0x0001           | Read-only     |
 * | All other values | Reserved      |
 *
 * All values not explicitly defined are reserved for future use. This protection field is distinctly different in scope from the AccessCapability field present in the StorageInfo data set described in 5.5.4. If an attempt is made to delete an object, success will only occur if the ProtectionStatus of the object is 0x0000 and the AccessCapability of the store allows deletion. If a device does not support object protection, this field should always be set to 0x0000, and the SetProtection operation should not be supported. Refer to 5.5.4 for a description of the StorageInfo data set.
 *
 * ThumbFormat: indicates ObjectFormat of the thumbnail. In order for an object to be referred to as an image, it must be able to produce a thumbnail as the response to a request. Therefore, this value should only be 0x00000000 for the case of non-image objects. Refer to 6.3 for a list of ObjectFormatCodes.
 * ThumbCompressedSize: the size of the buffer needed to hold the thumbnail. This field may be used for memory allocation purposes. In order for an object to be referred to as an image, it must be able to produce a thumbnail as the response to a request. Therefore, this value should only be 0x00000000 for the case of non-image objects.
 * ThumbPixWidth: an optional field representing the width of the thumbnail in pixels. If this field is not supported or the object is not an image, the value 0x00000000 shall be used.
 * ThumbPixHeight: an optional field representing the height of the thumbnail in pixels. If this field is not supported or the object is not an image, the value 0x00000000 shall be used.
 * ImgPixWidth: an optional field representing the width of the image in pixels. If the data are not known to be an image, this field should be set to 0x00000000. The purpose of this field is to enable an application to provide the width information to a user prior to transferring the image. If this field is not supported, the value 0x00000000 shall be used.
 * ImgPixHeight: an optional field representing the height of the image in pixels. If the data are not known to be an image, this field should be set to 0x00000000. The purpose of this field is to enable an application to provide the height information to a user prior to transferring the image. If this field is not supported, the value 0x00000000 shall be used.
 * ImgBitDepth: an optional field representing the total number of bits per pixel of the uncompressed image. If the data are not known to be an image, this field should be set to 0x00000000. The purpose of this field is to enable an application to provide the bit depth information to a user prior to transferring the image. This field does not attempt to specify the number of bits assigned to particular colour channels, but instead represents the total number of bits used to describe one pixel. If this field is not supported, the value 0x00000000 shall be used. This field should not be used for memory allocation purposes, but is strictly information that is typically inside an image object that may affect whether or not a user wishes to transfer the image, and is therefore exposed prior to object transfer in the ObjectInfo data set.
 * ParentObject: indicates the handle of the object that is the parent of this object. The ParentObject must be of object type Association. If the device does not support associations, or the object is in the "root" of the hierarchical store, then this value should be set to 0x00000000.
 * AssociationType: a field that is only used for objects of type Association. This code indicates the type of association. Refer to 6.5 for a description of associations and a list of defined types. If the object is not an association, this field should be set to 0x0000.
 * AssociationDesc: This field is used to hold a descriptor parameter for the association, and may therefore only be non-zero if the AssociationType is non-zero. The interpretation of this field is dependent upon the particular AssociationType, and is only used for certain types of association. If unused, this field should be set to 0x00000000. Refer to 6.5 for information on this descriptor.
 * SequenceNumber: This field is optional, and is only used if the object is a member of an association, and only if the association is ordered. If the object is not a member of an ordered association, this value should be set to 0x00000000. These numbers should be created consecutively. However, to be a valid sequence, they do not need to be consecutive, but only monotonically increasing. Therefore, if a data object in the sequence is deleted, the SequenceNumbers of the other objects in the ordered association do not need to be renumbered, and examination of the sequential numbers will indicate a possibly deleted object by the missing sequence number.
 * Filename: an optional string representing filename information. This field should not include any filesystem path information, but only the name of the file or directory itself. The interpretation of this string is dependent upon the FilenameFormat field in the StorageInfo data set that describes the logical storage area in which this object is stored. See 5.5.4 for information on this field.
 * CaptureDate: a static optional field representing the time that the data object was initially captured. This is not necessarily the same as any date held in the ModificationDate field. This data set uses the DateTime string described in 5.3.5.2.
 * ModificationDate: an optional field representing the time of last modification of the data object. This is not necessarily the same as the CaptureDate field. This data set uses the DateTime string described in 5.3.5.2.
 * Keywords: an optional string representing keywords associated with the image. Each keyword shall be separated by a space. A keyword that consists of more than one word shall use underscore (\_) characters to separate individual words within one keyword.
 */

export type ObjectInfo = {
    storageId: HexCode // DataType.UINT32 (StorageID)
    objectFormat: HexCode // DataType.UINT16 (ObjectFormatCode)
    protectionStatus: HexCode // DataType.UINT16
    objectCompressedSize: number // DataType.UINT32
    thumbFormat: HexCode // DataType.UINT16 (ObjectFormatCode)
    thumbCompressedSize: number // DataType.UINT32
    thumbPixWidth: number // DataType.UINT32
    thumbPixHeight: number // DataType.UINT32
    imagePixWidth: number // DataType.UINT32
    imagePixHeight: number // DataType.UINT32
    imageBitDepth: number // DataType.UINT32
    parentObject: HexCode // DataType.UINT32 (ObjectHandle)
    associationType: HexCode // DataType.UINT16 (AssociationCode)
    associationDesc: HexCode // DataType.UINT32 (AssociationDesc)
    sequenceNumber: number // DataType.UINT32
    filename: string // DataType.STRING
    captureDate: string // DataType.STRING (DateTime)
    modificationDate: string // DataType.STRING (DateTime)
    keywords: string // DataType.STRING
}

export type ObjectInfoParsed = {
    storageId: HexCode
    objectFormat: HexCode
    objectFormatName: string
    objectFormatDescription: string
    protectionStatus: HexCode
    protectionStatusDescription: string
    objectCompressedSize: number
    thumbFormat: HexCode
    thumbFormatName: string
    thumbCompressedSize: number
    thumbPixWidth: number
    thumbPixHeight: number
    imagePixWidth: number
    imagePixHeight: number
    imageBitDepth: number
    parentObject: HexCode
    associationType: HexCode
    associationDesc: HexCode
    sequenceNumber: number
    filename: string
    captureDate: string
    modificationDate: string
    keywords: string
    isImage: boolean
    isProtected: boolean
}

export const parseObjectInfo = (data: Uint8Array): ObjectInfoParsed => {
    // Check minimum data size (at least up to SequenceNumber - 4+2+2+4+2+4+4+4+4+4+4+4+2+4+4 = 60 bytes)
    if (data.length < 60) {
        throw new Error(`Invalid ObjectInfo data: expected at least 60 bytes, got ${data.length}`)
    }

    const view = createDataView(data)
    let offset = 0

    // 1. StorageID (UINT32)
    const storageId = view.getUint32(offset, true)
    offset += 4

    // 2. ObjectFormat (UINT16)
    const objectFormat = view.getUint16(offset, true)
    offset += 2

    // 3. ProtectionStatus (UINT16)
    const protectionStatus = view.getUint16(offset, true)
    offset += 2

    // 4. ObjectCompressedSize (UINT32)
    const objectCompressedSize = view.getUint32(offset, true)
    offset += 4

    // 5. ThumbFormat (UINT16)
    const thumbFormat = view.getUint16(offset, true)
    offset += 2

    // 6. ThumbCompressedSize (UINT32)
    const thumbCompressedSize = view.getUint32(offset, true)
    offset += 4

    // 7. ThumbPixWidth (UINT32)
    const thumbPixWidth = view.getUint32(offset, true)
    offset += 4

    // 8. ThumbPixHeight (UINT32)
    const thumbPixHeight = view.getUint32(offset, true)
    offset += 4

    // 9. ImagePixWidth (UINT32)
    const imagePixWidth = view.getUint32(offset, true)
    offset += 4

    // 10. ImagePixHeight (UINT32)
    const imagePixHeight = view.getUint32(offset, true)
    offset += 4

    // 11. ImageBitDepth (UINT32)
    const imageBitDepth = view.getUint32(offset, true)
    offset += 4

    // 12. ParentObject (UINT32)
    const parentObject = view.getUint32(offset, true)
    offset += 4

    // 13. AssociationType (UINT16)
    const associationType = view.getUint16(offset, true)
    offset += 2

    // 14. AssociationDesc (UINT32)
    const associationDesc = view.getUint32(offset, true)
    offset += 4

    // 15. SequenceNumber (UINT32)
    const sequenceNumber = view.getUint32(offset, true)
    offset += 4

    // 16. Filename (String)
    const filename = decodePTPValue(sliceBuffer(data, offset), DataType.STRING) as string
    const filenameLength = getPTPStringLength(sliceBuffer(data, offset))
    offset += filenameLength

    // 17. CaptureDate (DateTime String)
    const captureDate = decodePTPValue(sliceBuffer(data, offset), DataType.STRING) as string
    const captureDateLength = getPTPStringLength(sliceBuffer(data, offset))
    offset += captureDateLength

    // 18. ModificationDate (DateTime String)
    const modificationDate = decodePTPValue(sliceBuffer(data, offset), DataType.STRING) as string
    const modificationDateLength = getPTPStringLength(sliceBuffer(data, offset))
    offset += modificationDateLength

    // 19. Keywords (String)
    const keywords = decodePTPValue(sliceBuffer(data, offset), DataType.STRING) as string

    // Determine protection status description
    let protectionStatusDescription = 'Unknown'
    if (protectionStatus === 0x0000) {
        protectionStatusDescription = 'No protection'
    } else if (protectionStatus === 0x0001) {
        protectionStatusDescription = 'Read-only'
    } else {
        protectionStatusDescription = 'Reserved'
    }

    // Determine if this is an image object (has thumbnail information)
    const isImage = thumbFormat !== 0x0000 && thumbCompressedSize !== 0x0000

    // Determine if object is protected
    const isProtected = protectionStatus === 0x0001

    // Look up object format info from PTPFormats
    const objectFormatInfo = Object.values(PTPFormats).find(f => f.code === objectFormat)
    const objectFormatName = objectFormatInfo?.name || `Unknown_0x${objectFormat.toString(16).padStart(4, '0')}`
    const objectFormatDescription = objectFormatInfo?.description || ''

    // Look up thumb format info from PTPFormats
    const thumbFormatInfo = Object.values(PTPFormats).find(f => f.code === thumbFormat)
    const thumbFormatName = thumbFormatInfo?.name || `Unknown_0x${thumbFormat.toString(16).padStart(4, '0')}`

    return {
        storageId,
        objectFormat,
        objectFormatName,
        objectFormatDescription,
        protectionStatus,
        protectionStatusDescription,
        objectCompressedSize,
        thumbFormat,
        thumbFormatName,
        thumbCompressedSize,
        thumbPixWidth,
        thumbPixHeight,
        imagePixWidth,
        imagePixHeight,
        imageBitDepth,
        parentObject,
        associationType,
        associationDesc,
        sequenceNumber,
        filename,
        captureDate,
        modificationDate,
        keywords,
        isImage,
        isProtected,
    }
}

// Helper function to calculate the length of a PTP string (including the length byte)
function getPTPStringLength(data: Uint8Array): number {
    if (data.length < 1) {
        return 0
    }
    const view = createDataView(data)
    // PTP strings start with a UINT8 indicating number of characters
    const numChars = view.getUint8(0)
    // Each character is 2 bytes (UTF-16), plus 1 byte for the length byte
    // Make sure we don't read beyond available data
    const expectedLength = 1 + numChars * 2
    if (expectedLength > data.length) {
        console.warn(`String length mismatch: expected ${expectedLength} bytes but only ${data.length} available`)
        return data.length
    }
    return expectedLength
}

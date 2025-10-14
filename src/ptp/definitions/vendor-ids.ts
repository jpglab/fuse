/**
 * Centralized vendor ID constants for camera manufacturers
 * These USB vendor IDs identify different camera manufacturers
 */

export const VendorIDs = {
    SONY: 0x054c,
    CANON: 0x04a9,
    NIKON: 0x04b0,
    FUJIFILM: 0x04cb,
    PANASONIC: 0x04da,
    OLYMPUS: 0x07b4,
} as const

/**
 * Type for vendor IDs
 */
export type VendorID = (typeof VendorIDs)[keyof typeof VendorIDs]

/**
 * Vendor names mapping
 */
export const VendorNames: Record<VendorID, string> = {
    [VendorIDs.SONY]: 'Sony Group Corporation',
    [VendorIDs.CANON]: 'Canon Inc.',
    [VendorIDs.NIKON]: 'Nikon Corporation',
    [VendorIDs.FUJIFILM]: 'Fujifilm Corporation',
    [VendorIDs.PANASONIC]: 'Panasonic Corporation',
    [VendorIDs.OLYMPUS]: 'Olympus Corporation',
}

/**
 * Get vendor name from vendor ID
 */
function isValidVendorID(vendorId: number): vendorId is VendorID {
    return vendorId in VendorNames
}

export function getVendorName(vendorId: number): string {
    return isValidVendorID(vendorId) ? VendorNames[vendorId] : 'Unknown Vendor'
}

/**
 * Check if a vendor ID is supported
 */
export function isSupportedVendor(vendorId: number): boolean {
    const values: number[] = Object.values(VendorIDs)
    return values.includes(vendorId)
}

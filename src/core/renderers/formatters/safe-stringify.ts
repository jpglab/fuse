/**
 * Safely stringify values including BigInt
 * JSON.stringify cannot handle BigInt, so we convert them to strings
 */
export function safeStringify(value: any): string {
    if (typeof value === 'bigint') {
        return value.toString()
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, (key, val) =>
            typeof val === 'bigint' ? val.toString() : val
        )
    }
    return JSON.stringify(value)
}

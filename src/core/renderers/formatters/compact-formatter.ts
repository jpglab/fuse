import { safeStringify } from './safe-stringify'

const MAX_LINE_WIDTH = 100

/**
 * Generic JSON formatter with line wrapping and proper indentation
 */
export function formatJSON(
    val: number | bigint | string | boolean | null | undefined | object | Uint8Array,
    indent: number = 0
): string[] {
    const lines: string[] = []
    const baseIndent = '  '.repeat(indent)

    if (val === null || val === undefined) {
        return [baseIndent + safeStringify(val)]
    }

    if (typeof val === 'bigint') {
        return [baseIndent + val.toString()]
    }

    if (typeof val !== 'object') {
        return [baseIndent + safeStringify(val)]
    }

    if (Array.isArray(val)) {
        if (val.length === 0) {
            return [baseIndent + '[]']
        }

        // Convert items to strings
        const items = val.map(v => {
            if (typeof v === 'bigint') return v.toString()
            if (typeof v === 'number') return `0x${v.toString(16)}`
            if (typeof v === 'object' && v !== null) return safeStringify(v)
            return safeStringify(v)
        })

        // Try to fit on one line
        const oneLine = `${baseIndent}[${items.join(', ')}]`
        if (oneLine.length <= MAX_LINE_WIDTH) {
            return [oneLine]
        }

        // Wrap across multiple lines
        lines.push(baseIndent + '[')

        let currentLine = ''
        const itemIndent = '  '.repeat(indent + 1)

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const separator = i < items.length - 1 ? ', ' : ''

            if (currentLine === '') {
                // Start new line
                currentLine = item + separator
            } else {
                // Try adding to current line
                const testLine = currentLine + ' ' + item + separator
                if ((itemIndent + testLine).length <= MAX_LINE_WIDTH) {
                    currentLine = testLine
                } else {
                    // Flush current line and start new one
                    lines.push(itemIndent + currentLine)
                    currentLine = item + separator
                }
            }
        }

        // Flush remaining line
        if (currentLine) {
            lines.push(itemIndent + currentLine)
        }

        lines.push(baseIndent + ']')
        return lines
    }

    // Object
    const entries = Object.entries(val)
    if (entries.length === 0) {
        return [baseIndent + '{}']
    }

    lines.push(baseIndent + '{')

    entries.forEach(([key, value], idx) => {
        const isLast = idx === entries.length - 1
        const comma = isLast ? '' : ','

        // Special handling for large binary data fields
        if (value instanceof Uint8Array && value.length > 100) {
            lines.push(`${baseIndent}  "${key}": <Uint8Array: ${value.length} bytes>${comma}`)
            return
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                lines.push(`${baseIndent}  "${key}": []${comma}`)
            } else {
                // Format array
                const items = value.map(v => {
                    if (typeof v === 'bigint') return v.toString()
                    if (typeof v === 'number') return `0x${v.toString(16)}`
                    if (typeof v === 'object' && v !== null) return safeStringify(v)
                    return safeStringify(v)
                })

                // Try to fit on one line
                const oneLine = `${baseIndent}  "${key}": [${items.join(', ')}]${comma}`
                if (oneLine.length <= MAX_LINE_WIDTH) {
                    lines.push(oneLine)
                } else {
                    // Wrap array across multiple lines
                    lines.push(`${baseIndent}  "${key}": [`)

                    let currentLine = ''
                    const arrayIndent = '  '.repeat(indent + 2)

                    for (let i = 0; i < items.length; i++) {
                        const item = items[i]
                        const arraySeparator = i < items.length - 1 ? ', ' : ''

                        if (currentLine === '') {
                            currentLine = item + arraySeparator
                        } else {
                            const testLine = currentLine + ' ' + item + arraySeparator
                            if ((arrayIndent + testLine).length <= MAX_LINE_WIDTH) {
                                currentLine = testLine
                            } else {
                                lines.push(arrayIndent + currentLine)
                                currentLine = item + arraySeparator
                            }
                        }
                    }

                    if (currentLine) {
                        lines.push(arrayIndent + currentLine)
                    }

                    lines.push(`${baseIndent}  ]${comma}`)
                }
            }
        } else if (value && typeof value === 'object' && value !== null) {
            // Nested object
            const nestedLines = formatJSON(value, indent + 1)
            lines.push(`${baseIndent}  "${key}": ${nestedLines[0].trim()}`)
            for (let i = 1; i < nestedLines.length; i++) {
                lines.push(nestedLines[i])
            }
            // Add comma if not last
            if (!isLast && lines[lines.length - 1]) {
                lines[lines.length - 1] += ','
            }
        } else {
            // Primitive value
            let formatted: string
            if (typeof value === 'bigint') {
                formatted = value.toString()
            } else if (typeof value === 'number') {
                formatted = `0x${value.toString(16)}`
            } else {
                formatted = safeStringify(value)
            }
            lines.push(`${baseIndent}  "${key}": ${formatted}${comma}`)
        }
    })

    lines.push(baseIndent + '}')
    return lines
}

/**
 * Legacy exports for compatibility
 */
export function formatCompact(
    val: number | bigint | string | boolean | null | undefined | object | Uint8Array,
    indent: number = 0,
    linePrefix: string = ''
): string {
    return formatJSON(val, indent).join('\n')
}

export function wrapArrayItems(items: string[], linePrefix: string, indent: string): string[] {
    // Legacy compatibility - not used with new formatter
    return [items.join(', ')]
}

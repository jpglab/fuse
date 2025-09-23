import type { Photo as IPhoto } from './types'

export class Photo implements IPhoto {
    public data: Buffer
    public filename: string
    public size: number
    public capturedAt: Date

    constructor(data: Buffer, filename: string, capturedAt?: Date) {
        this.data = data
        this.filename = filename
        this.size = data.length
        this.capturedAt = capturedAt || new Date()
    }

    async save(filePath: string): Promise<void> {
        // Dynamic import for Node.js filesystem operations
        // This allows the library to work in both Node.js and browser environments
        if (typeof window === 'undefined') {
            // Node.js environment
            const { promises: fs } = await import('fs')
            const path = await import('path')
            
            const dir = path.dirname(filePath)
            try {
                await fs.access(dir)
            } catch {
                await fs.mkdir(dir, { recursive: true })
            }
            await fs.writeFile(filePath, this.data)
        } else {
            // Browser environment - use File API or throw error
            throw new Error('Photo.save() is not available in browser environment. Use the Blob/File API instead.')
        }
    }

    toJSON() {
        return {
            filename: this.filename,
            size: this.size,
            capturedAt: this.capturedAt,
            dataSize: this.data.length,
        }
    }
}

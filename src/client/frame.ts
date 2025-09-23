import type { Frame as IFrame } from './types'

export class Frame implements IFrame {
    public data: Buffer
    public width: number
    public height: number
    public timestamp: number

    constructor(data: Buffer, width: number, height: number, timestamp?: number) {
        this.data = data
        this.width = width
        this.height = height
        this.timestamp = timestamp || Date.now()
    }

    get aspectRatio(): number {
        return this.width / this.height
    }

    get size(): number {
        return this.data.length
    }

    toJSON() {
        return {
            width: this.width,
            height: this.height,
            timestamp: this.timestamp,
            dataSize: this.data.length,
            aspectRatio: this.aspectRatio,
        }
    }
}

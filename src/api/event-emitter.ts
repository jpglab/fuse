/**
 * Cross-platform EventEmitter implementation
 * Works in both Node.js and browser environments
 */

type EventListener = (...args: any[]) => void

export class EventEmitter {
    private events: Map<string, EventListener[]> = new Map()

    on(event: string, listener: EventListener): this {
        if (!this.events.has(event)) {
            this.events.set(event, [])
        }
        this.events.get(event)!.push(listener)
        return this
    }

    off(event: string, listener: EventListener): this {
        const listeners = this.events.get(event)
        if (listeners) {
            const index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
            if (listeners.length === 0) {
                this.events.delete(event)
            }
        }
        return this
    }

    emit(event: string, ...args: any[]): boolean {
        const listeners = this.events.get(event)
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(...args)
                } catch (error) {
                    console.error(`Error in event listener for event "${event}":`, error)
                }
            })
            return true
        }
        return false
    }

    once(event: string, listener: EventListener): this {
        const onceWrapper = (...args: any[]) => {
            this.off(event, onceWrapper)
            listener(...args)
        }
        return this.on(event, onceWrapper)
    }

    removeAllListeners(event?: string): this {
        if (event) {
            this.events.delete(event)
        } else {
            this.events.clear()
        }
        return this
    }

    listenerCount(event: string): number {
        const listeners = this.events.get(event)
        return listeners ? listeners.length : 0
    }

    eventNames(): string[] {
        return Array.from(this.events.keys())
    }
}

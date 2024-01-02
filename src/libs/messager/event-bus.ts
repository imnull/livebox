import { genId } from "./utils"

class EventBus {
    private readonly events: Record<string, { (...args: any[]): void }[]>
    private readonly id: string
    constructor() {
        this.id = genId()
        this.events = {}
    }
    subscribe(name: string, callback: (...args: any[]) => void) {
        if (!Array.isArray(this.events[name])) {
            this.events[name] = []
        }
        this.events[name].push(callback)
        return { name, callback }
    }
    triggerEvent(name: string, ...params: any[]) {
        const callbacks = this.events[name]
        if (Array.isArray(callbacks)) {
            callbacks.forEach(cb => {
                try {
                    cb(...params)
                } catch (ex) {
                    console.log(`EventBus[${this.id}].triggerEvent error:`, ex)
                }
            })
        }
    }
}

export default EventBus
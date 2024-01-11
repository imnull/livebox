import { genId } from "./utils"

type TKey = string | number | symbol

class EventBus {
    private readonly events: Record<TKey, { (...args: any[]): void | Promise<void> }[]>
    private readonly id: string
    constructor() {
        this.id = genId()
        this.events = {}
    }
    subscribe(name: TKey, callback: (...args: any[]) => void | Promise<void>) {
        if (!Array.isArray(this.events[name])) {
            this.events[name] = []
        }
        this.events[name].push(callback)
        // return { name, callback }
    }
    remove(name: TKey, callback: any) {
        const callbacks = this.events[name]
        if(Array.isArray(callbacks)) {
            const idx = callbacks.indexOf(callback)
            if(idx > -1) {
                callbacks.splice(idx, 1)
            }
        }   
    }
    async triggerEvent(name: TKey, ...params: any[]) {
        const callbacks = this.events[name]
        if (Array.isArray(callbacks)) {
            for (let i = 0; i < callbacks.length; i++) {
                const cb = callbacks[i]
                try {
                    const res = cb(...params)
                    if (res instanceof Promise) {
                        await Promise.resolve(res)
                    }
                } catch (ex) {
                    console.log(`EventBus[${this.id}].triggerEvent error:`, ex)
                }
            }
        }
    }
    dispose() {
        Object.keys(this.events).forEach(key => {
            this.events[key] = []
        })
    }
    regist(mapper: { [key: string]: undefined | ((...args: any[]) => void) }) {
        Object.entries(mapper).forEach(([key, val]) => {
            if (typeof val === 'function') {
                this.subscribe(key, val)
            }
        })
    }
    unregist(mapper: { [key: string]: undefined | ((...args: any[]) => void) }) {
        Object.entries(mapper).forEach(([key, val]) => {
            if (typeof val === 'function') {
                this.remove(key, val)
            }
        })
    }
}

export default EventBus
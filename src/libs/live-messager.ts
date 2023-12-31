import { LOCAL_CHANNEL } from "~/config"
import { PeerMedia } from "./peer-media"

type TLiveMessagerBody = {
    from: string
    to?: string
    auth?: string
    data?: any
}

type TLiveMessagerType = ''
    | 'enter' | 'leave' | 'live'
    | 'ready' | 'request-live' | 'create-live'
    | 'public-enter'
    | 'public-get-info' | 'get-info'

type TLiveMessager = {
    type: TLiveMessagerType
} & TLiveMessagerBody

const GEN_ID_BASE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GEN_ID_LENGTH = 64
export const genId = () => {
    const now = Date.now().toString(36)
    const len = GEN_ID_LENGTH - now.length
    const mapper = GEN_ID_BASE.split('').sort(() => 0.5 - Math.random())
    const arr = Array(len).fill('').map(s => s + mapper[GEN_ID_BASE.length * Math.random() >> 0])
    arr.splice((len / 2) >> 0, 0, now)
    return ('' + arr.join('')).slice(0, len)
}

export class LiveMessager {
    private readonly signaling: BroadcastChannel
    private readonly events: { [key in TLiveMessagerType]?: { (body: TLiveMessagerBody): void }[] }
    // private readonly room: string
    protected readonly id: string
    constructor(room: string) {
        // this.room = room
        this.id = genId()
        this.events = {}
        this.signaling = new BroadcastChannel(room)
        this.signaling.onmessage = (e => {
            if (!e.data) {
                return
            }
            const { type, to, ...body } = e.data
            if (to === '*') {
                console.log('[public] triggerEvent:', { type, body })
                this.triggerEvent(type, body)
            } else if (to === this.id) {
                console.log('[private] triggerEvent:', { type, body })
                this.triggerEvent(type, body)
            }
        })
    }

    private triggerEvent(type: TLiveMessagerType, body: TLiveMessagerBody) {
        const cbs = this.events[type]
        if (!Array.isArray(cbs)) {
            return
        }
        cbs.forEach((cb, i) => {
            try {
                cb(body)
            } catch (ex) {
                console.log(`triggerEvent error ${type}[${i}]:`, ex)
            }
        })
    }

    protected emit(msg: TLiveMessager) {
        this.signaling.postMessage(msg)
    }
    protected subscribe(type: TLiveMessagerType, callback: (body: TLiveMessagerBody) => void) {
        if (!Array.isArray(this.events[type])) {
            this.events[type] = []
        }
        this.events[type]!.push(callback)
        return { type, callback }
    }

    get on() {
        return this.subscribe
    }
}

export class LiveMessagerRoom extends LiveMessager {
    private readonly members: {
        id: string
        live_channel: string
        live?: PeerMedia
    }[]
    constructor(room: string) {
        super(room)
        this.members = []
        this.subscribe('enter', ({ from }) => {
            let member = this.members.find(({ id }) => from === id)
            if (!member) {
                member = {
                    id: from,
                    live_channel: `${LOCAL_CHANNEL}_${from}`
                }
                this.members.push(member)
            }
            this.emit({ type: 'enter', from: this.id, to: from, data: member })
        })
        this.subscribe('public-get-info', ({ from }) => {
            this.emit({ type: 'get-info', from: this.id, to: from, data: { liveRoom: [`room1`, `room2`, `room3`] } })
        })

        this.subscribe('request-live', ({ from }) => {
            const member = this.members.find(({ id }) => from === id)
            if (!member) {
                this.emit({ type: 'live', from: this.id, to: from, data: { error: 'enter room first' } })
            } else {
                const { live_channel } = member
                this.emit({ type: 'live', from: this.id, to: from, data: live_channel })
                // this.emit({ type: 'create-live', from: this.id, to: from, data: live_channel })
            }
        })

        this.emit({ type: 'ready', from: this.id, to: '*' })
    }

    getMember(id: string) {
        return this.members.find(m => m.id === id) || null
    }
}

export class LiveMessagerClient extends LiveMessager {
    constructor(room: string) {
        super(room)
        this.subscribe('ready', body => {
            this.enterRoom()
        })
        // this.subscribe('get-info', body => {
        //     const { data = null } = body
        //     console.log(111111, data)
        // })
        this.subscribe('live', body => {
            const { data } = body
            if (!data) {
                return
            }
            console.log(33333, data)
        })
        // this.getPublicInfo()
        // this.enterRoom()
    }

    // getPublicInfo() {
    //     this.emit({ type: 'public-get-info', from: this.id, to: '*' })
    // }

    enterRoom() {
        this.emit({ type: 'enter', from: this.id, to: '*' })
    }

    requestLive() {
        this.emit({ type: 'request-live', from: this.id, to: '*' })
    }


}
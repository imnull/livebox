export type TSignalingOfferMessage = {
    type: 'offer'
    sdp?: string
}

export type TSignalingAnswerMessage = {
    type: 'answer'
    sdp?: string
}


export type TSignalingDataMessage = TSignalingOfferMessage | TSignalingAnswerMessage

export type TSignalingVoidMessage = {
    type: 'ready' | 'bye' | 'call' | 'call-accept'
}

export type TSignalingCandidateMessage = {
    type: 'candidate'
    candidate?: string
    sdpMid?: string
    sdpMLineIndex?: number
}



type TSignalingMessage = TSignalingDataMessage | TSignalingCandidateMessage | TSignalingVoidMessage

// type TSignalingData<T extends TSignalingMessage['type']>
//     = T extends TSignalingDataMessage['type'] ? TSignalingDataMessage['data']
//     : T extends TSignalingCandidateMessage['type'] ? TSignalingCandidateMessage['candidate']
//     : never

type TSignalingCallback<T extends TSignalingMessage['type']>
    = T extends TSignalingDataMessage['type'] ? { (data: TSignalingDataMessage): void | Promise<void> }
    : T extends TSignalingCandidateMessage['type'] ? { (data: TSignalingCandidateMessage): void | Promise<void> }
    : { (): void | Promise<void> }


export type TMessager = {
    emit(msg: TSignalingMessage): void
    on<T extends TSignalingMessage['type']>(type: T, fn: TSignalingCallback<T>): void
}

export abstract class Messager implements TMessager {
    private readonly events: { [key in TSignalingMessage['type']]?: (...args: any[]) => void | Promise<void> }
    constructor() {
        this.events = {}
    }
    abstract emit(msg: TSignalingMessage): void

    protected async trigger(msg: TSignalingMessage) {
        const { type } = msg
        const fn = this.events[type]
        if (typeof fn === 'function') {
            switch (type) {
                case 'answer':
                case 'offer': {
                    await fn(msg)
                    break
                }
                case 'candidate': {
                    await fn(msg)
                    break
                }
                default: {
                    await fn()
                    break
                }
            }
        }
    }
    on<T extends TSignalingMessage['type']>(type: T, fn: TSignalingCallback<T>): void {
        this.events[type] = fn
    }
}

export class BroadcastChannelMessager extends Messager {

    private readonly signaling
    constructor(channelId: string) {
        super()
        this.signaling = new BroadcastChannel(channelId)
        this.signaling.onmessage = e => {
            if (!e.data) {
                return
            }
            this.trigger(e.data)
        }
    }
    emit(msg: TSignalingMessage) {
        console.log('BroadcastChannelMessager', msg)
        this.signaling.postMessage(msg)
    }
}

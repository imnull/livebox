import EventBus from "./event-bus"
import { TMessagerConfig, TCommandExtra, TMessage, TMessageInner, TCoreMessager, TMessagerCoreConfig, TMessageCommandCallbackMap } from "./type"
import { genId } from "./utils"

export class Messager<C extends TCommandExtra = never> { 

    protected readonly core: TCoreMessager
    protected readonly namespace: string
    protected readonly identity: string
    protected readonly groups: string[]
    protected readonly blocks: string[]
    protected readonly events: EventBus

    public onMessage?: (msg: TMessageInner & C) => void

    constructor(config: TMessagerConfig & TMessagerCoreConfig) {

        const { core, namespace = '', groups = [], blocks = [] } = config

        this.core = core
        this.identity = genId()
        this.namespace = namespace
        this.groups = [...groups]
        this.blocks = [...blocks]
        this.events = new EventBus()

        this.init()
    }

    protected init() {
        this.core.useCallback(data => {
            this.triggerEvent(data)
        })
        // console.log(`Messager [${this.getIdentity()}] init:`, new Date())
    }

    private checkMessage(message: TMessageInner) {
        if (!message.sender || this.blocks.includes(message.sender)) {
            return false
        }
        switch (message.target) {
            case 'public':
                return true
            case 'group':
                return this.groups.includes(message.group)
            case 'private':
                return this.getIdentity() === message.reciever
        }
        return false
    }

    private triggerEvent(message: TMessageInner & C) {
        if (!this.checkMessage(message)) {
            return
        }
        if(typeof this.onMessage === 'function') {
            this.onMessage(message)
        }
        this.events.triggerEvent(message.command, message)
    }

    getIdentity() {
        return this.identity
    }

    joinGroup(...groups: string[]) {
        groups.forEach(group => {
            !this.groups.includes(group) && this.groups.push(group)
        })
    }

    blockSender(...senders: string[]) {
        senders.forEach(sender => {
            !this.blocks.includes(sender) && this.blocks.push(sender)
        })
    }

    regist(mapper: TMessageCommandCallbackMap<C, TMessageInner>) {
        return this.events.regist(mapper)
    }

    emit(message: TMessageInner & C) {
        this.triggerEvent(message)
    }

    send(msg: TMessage & C) {
        const innerMessage: TMessageInner & C = { ...msg, sender: this.getIdentity() }
        this.core.poseMessage(innerMessage)
    }

    close() {
        this.events.dispose()
        this.core.close()
    }
}
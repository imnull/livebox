import EventBus from "./event-bus"
import { TMessagerConfig, TCommandExtra, TCommandHello, TMessage, TMessageInner, TCoreMessager, TMessagerCoreConfig } from "./type"
import { genId } from "./utils"

export class Messager<C extends TCommandExtra = TCommandHello> {

    protected readonly core: TCoreMessager
    protected readonly namespace: string
    protected readonly identity: string
    protected readonly groups: string[]
    protected readonly blocks: string[]
    protected readonly events: EventBus
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
        console.log(`Messager [${this.identity}] init:`, new Date())
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
                return this.identity === message.reciever
        }
        return false
    }

    private triggerEvent(message: TMessage & C) {
        const innerMessage: TMessageInner & C = { ...message, sender: this.identity }
        if (!this.checkMessage(innerMessage)) {
            return
        }
        this.events.triggerEvent(innerMessage.command, message)
    }

    getIdentity() {
        return this.identity
    }

    on<T extends C = C>(command: T['command'], callback: (data: TMessageInner & T) => void) {
        this.events.subscribe(command, callback)
    }

    send(msg: TMessage & C) {
        const innerMessage: TMessageInner | C = { ...msg, sender: this.identity }
        this.core.poseMessage(innerMessage)
    }
}
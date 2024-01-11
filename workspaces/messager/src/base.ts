import EventBus from "./event-bus"
import { TMessagerConfig, TCommandExtra, TMessage, TMessageInner, TCoreMessager, TMessagerCoreConfig, TMessageCommandCallbackMap, TMessager, TMergeCommand, TMessageCommandMap, TExtraCommand, TCommandMap, TCommandHello } from "./type"
import { genId } from "./utils"

const isCommand = (v: any): v is { command: string } => {
    return v && v.command && typeof v.command === 'string'
}

export class Messager<C extends TCommandExtra = null> implements TMessager<C> {

    protected readonly core: TCoreMessager
    protected readonly namespace: string
    protected readonly identity: string
    protected readonly groups: string[]
    protected readonly blocks: string[]
    protected readonly events: EventBus

    public onMessage?: (msg: TMergeCommand<TMessageInner, C>) => void

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
        }, this.identity)
        if(typeof this.core.onReady === 'function') {
            this.core.onReady(this)
        }
        // console.log(`Messager [${this.getIdentity()}] init:`, new Date())
    }

    private checkMessage(message: TMergeCommand<TMessageInner, C>) {
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

    private triggerEvent(message: TMergeCommand<TMessageInner, C>) {
        if(!isCommand(message)) {
            return
        }
        if (!this.checkMessage(message)) {
            return
        }
        if (typeof this.onMessage === 'function') {
            this.onMessage(message)
        }
        this.events.triggerEvent(message.command, message)
    }

    private buildInnerMessage(msg: TMergeCommand<TMessage, C>) {
        return { ...msg, sender: this.getIdentity() } as TMergeCommand<TMessageInner, C>
    }

    getIdentity() {
        return this.identity
    }
    
    getNamespace() {
        return this.namespace
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
    unregist(mapper: TMessageCommandCallbackMap<C, TMessageInner>) {
        return this.events.unregist(mapper)
    }

    emit(message: TMergeCommand<TMessage, C>) {
        const innerMessage = this.buildInnerMessage(message)
        this.triggerEvent(innerMessage)
    }

    send(message: TMergeCommand<TMessage, C>) {
        const innerMessage = this.buildInnerMessage(message)
        this.core.poseMessage(innerMessage, this.identity)
    }

    close() {
        this.events.dispose()
        this.core.close(this.identity)
    }
}

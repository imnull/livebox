import EventBus from "./event-bus"
import { TMessagerConfig, TCommandExtra, TCommandHello, TMessage, TMessageInner, TCoreMessager, TMessagerCoreConfig, TMessageCommandCallbackMap } from "./type"
import { genId } from "./utils"

export class Messager<C extends TCommandExtra = TCommandHello> {

    protected readonly core: TCoreMessager<C>
    protected readonly namespace: string
    protected readonly identity: string
    protected fakeIdentity: string = ''
    protected readonly groups: string[]
    protected readonly blocks: string[]
    protected readonly events: EventBus
    constructor(config: TMessagerConfig & TMessagerCoreConfig<C>) {

        const { core, namespace = '', groups = [], blocks = [] } = config

        this.core = core
        this.identity = genId()
        this.fakeIdentity = ''
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
        console.log(`Messager [${this.getIdentity()}] init:`, new Date())
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
        this.events.triggerEvent(message.command, message)
    }



    replaceIdentity(fakeId: string = '') {
        this.fakeIdentity = fakeId
    }

    getRawIdentity() {
        return this.identity
    }

    getIdentity() {
        if (this.fakeIdentity) {
            return this.fakeIdentity
        } else {
            return this.identity
        }
    }

    regist(mapper: TMessageCommandCallbackMap<C, TMessageInner>) {
        return this.events.regist(mapper)
    }

    // on<T extends C = C>(command: T['command'], callback: (data: TMessageInner & T) => void) {
    //     console.log(8888888111111, 'on', command)
    //     this.events.subscribe(command, callback)
    // }

    // on(command: C['command'], callback: (data: TExtraCommand<C, typeof command>) => void) {
    //     console.log(8888888111111, 'on', command)
    //     this.events.subscribe(command, callback)
    // }

    send(msg: TMessage & C) {
        const innerMessage: TMessageInner & C = { ...msg, sender: this.getIdentity() }
        this.core.poseMessage(innerMessage)
    }

    close() {
        this.events.dispose()
        this.core.close()
    }
}
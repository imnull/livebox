import { TExtraCommand, TMessageBase, TMessageSender, TMessager, TMessagerCore } from './type'
import { genId } from './utils'

export default class Messager<C extends { command: string } = any> implements TMessager<C> {
    private readonly events: { [key in C['command']]?: (msg: TExtraCommand<C, key> & TMessageBase) => void }
    private readonly identity: string
    private readonly core: TMessagerCore<C>
    constructor(core: TMessagerCore<C>) {
        this.core = core
        this.events = {}
        this.identity = core.identity || genId()

        this.core.listen(msg => {
            if (!this.checkMessage(msg)) {
                console.log(`WS client checked failed:`, this.identity, msg)
                return
            }
            console.log('WS client checked:', msg)
            const { [msg.command as C['command']]: callback } = this.events
            if (typeof callback === 'function') {
                callback(msg)
            }
        })
    }
    private checkMessage(msg: TMessageBase & TMessageSender) {
        console.log('------->', msg.sender, this.identity)
        if (!msg.sender || msg.sender === this.identity) {
            return false
        } if (msg.target === 'public') {
            return true
        } else if (msg.target === 'private' && msg.receiver === this.identity) {
            return true
        } else {
            return false
        }
    }

    get id() {
        return this.identity
    }
    on(events: { [key in C["command"]]?: ((msg: TExtraCommand<C, key> & TMessageBase & TMessageSender) => void) | undefined }): void {
        Object.assign(this.events, events)
    }
    off(...names: C['command'][]) {
        names.forEach(name => {
            if (typeof this.events[name] === 'function') {
                this.events[name] = undefined
            }
        })
    }
    send(msg: C & TMessageBase): void {
        const { target = 'public', ...rest } = msg
        const m: any = { ...rest, target, sender: this.identity }
        this.core.post(m)
    }
    close() {
        this.core.close()
    }
}
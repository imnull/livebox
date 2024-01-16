import { Messager, messagerGenerator, TCoreMaker, TMessage, TMessager, TMessagerConfig, TMessagerCoreConfig } from '@imnull/messager'
import type { WebSocket } from 'ws'

type TWSSMessageConfig = TMessagerConfig & { ws: WebSocket; socketid: string; }
type TWSSMessage = TMessager & {
    getSocketId(): string
    forward(data: any): void
}

class MessageCluster {
    private readonly mapper: Record<string, TWSSMessage[]>
    constructor() {
        this.mapper = {}
    }
    regist(msg: TWSSMessage) {
        const ns = msg.getNamespace()
        if (!Array.isArray(this.mapper[ns])) {
            this.mapper[ns] = []
        }
        const exists = this.mapper[ns].some(m => m.getSocketId() === msg.getSocketId())
        if (!exists) {
            this.mapper[ns].push(msg)
        }
    }
    emit(data: any) {
        if (!data) {
            return
        }
        const { namespace, sender, receiver, target } = data
        if (!namespace || !sender) {
            return
        }
        const msgers = this.mapper[namespace]
        if (Array.isArray(msgers)) {
            msgers.forEach(msger => {
                const id = msger.getIdentity()
                // console.log({ id, sender, receiver, target })

                // `msger`即`sender`
                if (id === sender) {
                    return
                }

                // 私信通道，当前`id`与`receiver`不符
                if(target === 'private' && id !== receiver) {
                    return
                }

                msger.forward(data)

                // if(target === 'public') {
                //     console.log(1111, data, sender)
                //     msger.send(data)
                // } else if(target === 'private' && receiver === id) {
                //     console.log(2222, data)
                //     msger.send(data)
                // }
            })
        }
    }
}

export const cluster = new MessageCluster()



class WSSMessage extends Messager implements TWSSMessage {
    private readonly socketid: string
    constructor(config: TWSSMessageConfig & TMessagerCoreConfig) {
        super(config)
        const { socketid } = config
        this.socketid = socketid
    }

    getSocketId() {
        return this.socketid
    }

    forward(data: any) {
        this.core.poseMessage(data, '')
    }
}

const makeCore: TCoreMaker<TWSSMessageConfig> = (config) => {
    const { ws, namespace, socketid } = config
    return {
        useCallback(cb) {
            ws.on('message', msg => {
                const txt = msg.toString('utf-8')
                try {
                    const data = JSON.parse(txt)
                    // console.log(`[I]${'<'.repeat(12)}`, data)
                    cb(data)
                    // cluster.emit(namespace, data, id)
                } catch (ex) {
                    console.log(`[I]${'<'.repeat(12)} error`, ex)
                }
            })
        },
        poseMessage(data, sender) {
            console.log('-----> forward message:\n', data)
            ws.send(JSON.stringify({ ...data, namespace, socketid }))
        },
        close() {
            // ws.close()
        },
        identity: socketid,
    }
}

export const createMessager = (config: TWSSMessageConfig) => messagerGenerator(WSSMessage, makeCore)(config)





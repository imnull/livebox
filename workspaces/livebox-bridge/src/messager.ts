import { Messager, messagerGenerator, TCoreMaker, TMessage, TMessager, TMessagerConfig } from '@imnull/messager'
import type { WebSocket } from 'ws'

class MessageCluster {
    private readonly mapper: Record<string, TMessager[]>
    constructor() {
        this.mapper = {}
    }
    regist(msg: TMessager) {
        const ns = msg.getNamespace()
        if(!Array.isArray(this.mapper[ns])) {
            this.mapper[ns] = []
        }
        const exists = this.mapper[ns].some(m => m.getIdentity() === msg.getIdentity())
        if(!exists) {
            this.mapper[ns].push(msg)
        }
    }
    emit(data: any) {
        if(!data) {
            return
        }
        const { namespace, sender } = data
        if(!namespace || !sender) {
            return
        }
        const msgers = this.mapper[namespace]
        if(Array.isArray(msgers)) {
            msgers.forEach(msger => {
                if(msger.getIdentity() !== sender) {
                    msger.send(data)
                }
            })
        }
    }
}

export const cluster = new MessageCluster()

type TWSSMessageConfig = TMessagerConfig & { ws: WebSocket }

const makeCore: TCoreMaker<TWSSMessageConfig> = (config) => {
    const { ws, namespace = '' } = config
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
        poseMessage(data) {
            ws.send(JSON.stringify({ ...data, namespace }))
        },
        close() {
            // ws.close()
        },
        // onReady(msger) {
        //     cluster.regist(namespace, msger)
        // }
    }
}

export const createMessager = (config: TWSSMessageConfig) => messagerGenerator(Messager, makeCore)(config)





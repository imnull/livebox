import { TMessagerConfig, TCoreMessager } from "./type"
import { generator, generatorPromise } from "./generator"
import { genId } from "./utils"

const createCore = (signaling: WebSocket, namespace: string, socketid: string): TCoreMessager => {
    return {
        useCallback(cb) {
            signaling.onmessage = async e => {
                if (!e.data) {
                    return
                }
                // console.log(`[I]${'<'.repeat(12)}`, e.data)
                try {
                    const data = JSON.parse(e.data)
                    cb(data)
                } catch (ex) {
                    console.log(`[I]${'<'.repeat(12)} error`, ex)
                }
            }
        },
        poseMessage(data) {
            const d = { ...data, namespace, socketid }
            // console.log(`[O]${'>'.repeat(12)}`, d)
            signaling.send(JSON.stringify(d))
        },
        close() {
            signaling.close()
        },
    }
}

const makeCorePromise = (config: TMessagerConfig): Promise<TCoreMessager> => new Promise((resolve, reject) => {
    const { uri = '', namespace = '' } = config
    if (!uri) {
        throw 'Need websocket uri'
    }
    if (!namespace) {
        throw 'Need namespace'
    }
    const signaling = new WebSocket(uri)
    const socketid = genId()

    signaling.onopen = () => {
        signaling.send(JSON.stringify({ namespace, command: 'websocket-regist', socketid }))
    }
    signaling.onerror = e => {
        reject(e)
    }
    signaling.onmessage = e => {
        try {
            const data = JSON.parse(e.data)
            if(data && data.namespace === namespace && data.command === 'websocket-regist-ok') {
                signaling.onmessage = null
                resolve(createCore(signaling, namespace, socketid))
            } else {
                reject(data)
            }
    } catch(ex) {
            reject(ex)
        }
    }
})

export default generatorPromise(makeCorePromise)
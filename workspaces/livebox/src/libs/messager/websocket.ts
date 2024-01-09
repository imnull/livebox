import { TMessagerConfig, TCoreMessager, genId } from "@imnull/messager"
import { generatorPromise } from "./generator"

const createCore = (signaling: WebSocket, namespace: string): TCoreMessager => {
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
            const d = { ...data, namespace }
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

    signaling.onopen = () => {
        signaling.send(JSON.stringify({ namespace, command: 'websocket-regist' }))
    }
    signaling.onerror = e => {
        reject(e)
    }
    signaling.onmessage = e => {
        try {
            const data = JSON.parse(e.data)
            if(data && data.namespace === namespace && data.command === 'websocket-regist-ok') {
                signaling.onmessage = null
                resolve(createCore(signaling, namespace))
            } else {
                reject(data)
            }
    } catch(ex) {
            reject(ex)
        }
    }
})

export default generatorPromise(makeCorePromise)
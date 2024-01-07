import { TMessagerConfig, TCoreMessager } from "./type"
import { generator, generatorPromise } from "./generator"

const createCore = (signaling: WebSocket): TCoreMessager => {
    return {
        useCallback(cb) {
            signaling.onmessage = async e => {
                if (!e.data) {
                    return
                }
                console.log(`[I]${'<'.repeat(12)}`, e.data)
                try {
                    const data = JSON.parse(e.data)
                    cb(data)
                } catch(ex) {
                    console.log(`[I]${'<'.repeat(12)} error`, ex)
                }
            }
        },
        poseMessage(data) {
            console.log(`[O]${'>'.repeat(12)}`, data)
            signaling.send(JSON.stringify(data))
        },
        close() {
            signaling.close()
        },
    }
}

const makeCorePromise = (config: TMessagerConfig): Promise<TCoreMessager> => new Promise((resolve, reject) => {
    const { prefix = '', namespace = '' } = config
    if (!namespace) {
        throw 'Need namespace'
    }
    let uri = namespace
    if (prefix) {
        uri = `${prefix}/${uri}`
    }
    const signaling = new WebSocket(uri)

    signaling.onopen = () => {
        resolve(createCore(signaling))
    }
    signaling.onerror = e => {
        reject(e)
    }
})

export default generatorPromise(makeCorePromise)
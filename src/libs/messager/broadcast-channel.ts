import { TMessagerConfig, TCoreMessager } from "./type"
import { generator, generatorPromise } from "./generator"

const makeCore = (config: TMessagerConfig): TCoreMessager => {
    const { namespace = '' } = config
    if (!namespace) {
        throw 'Need namespace'
    }
    const signaling = new BroadcastChannel(namespace)
    return {
        useCallback(cb) {
            signaling.onmessage = (e) => {
                if (!e.data) {
                    return
                }
                // console.log(`[I]${namespace}${'<'.repeat(12)}`, e.data)
                cb(e.data)
            }
        },
        poseMessage(data) {
            // console.log(`[O]${namespace}${'>'.repeat(12)}`, data)
            signaling.postMessage(data)
        },
        close() {
            signaling.close()
        },
    }
}

const createCore = (signaling: BroadcastChannel): TCoreMessager => {
    return {
        useCallback(cb) {
            signaling.onmessage = (e) => {
                if (!e.data) {
                    return
                }
                // console.log(`[I]${namespace}${'<'.repeat(12)}`, e.data)
                cb(e.data)
            }
        },
        poseMessage(data) {
            // console.log(`[O]${namespace}${'>'.repeat(12)}`, data)
            signaling.postMessage(data)
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
    const signaling = new BroadcastChannel(namespace)

    Promise.resolve(createCore(signaling)).then(resolve, reject)
})

// export default generator(makeCore)
export default generatorPromise(makeCorePromise)
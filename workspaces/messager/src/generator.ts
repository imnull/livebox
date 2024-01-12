import {
    TCommandExtra, TCoreMessager, TMessager, TMessagerConfig, TMessagerCoreConfig,
    TGenerator, TGeneratorAsync,
    
} from "./type"

import { Messager } from "./base"


export const messagerGenerator: TGenerator = (C, maker) => {
    return (config) => {
        const core = maker(config)
        return new C({ ...config, core })
    }
}


export const messagerGeneratorAsync: TGeneratorAsync = (C, maker) => {
    return async (config) => {
        const core = await maker(config)
        return new C({ ...config, core })
    }
}

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
                cb(e.data as any)
            }
        },
        poseMessage(data) {
            signaling.postMessage(data)
        },
        close() {
            signaling.close()
        },
    }
}
const makeCorePromise = (config: TMessagerConfig): Promise<TCoreMessager> => Promise.resolve(makeCore(config))

export const createMessagerBroadcastChannel = <C extends TCommandExtra = null>(config: TMessagerConfig) => messagerGenerator<TMessagerConfig, C, TMessager<C>>(Messager<C>, makeCore)(config)
export const createMessagerBroadcastChannelAsync = <C extends TCommandExtra = null>(config: TMessagerConfig) => messagerGeneratorAsync<TMessagerConfig, C, TMessager<C>>(Messager<C>, makeCorePromise)(config)



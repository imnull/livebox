import { TCommandExtra, TCommandHello, TCoreMaker, TCoreMakerAsync, TCoreMessager, TMessagerConfig, TMessagerCoreConfig } from "./type"

import { Messager } from "./base"


export const messagerGenerator = <C extends TCommandExtra = never, T extends Messager<C> = Messager<C>>(C: new (config: TMessagerConfig & TMessagerCoreConfig) => T, maker: TCoreMaker) => {
    return (config: TMessagerConfig) => {
        const core = maker(config)
        return new C({ ...config, core })
    }
}

export const messagerGeneratorAsync = <C extends TCommandExtra = never, T extends Messager<C> = Messager<C>>(C: new (config: TMessagerConfig & TMessagerCoreConfig) => T, maker: TCoreMakerAsync) => {
    return async (config: TMessagerConfig) => {
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

export const createMessagerBroadcastChannel = <C extends TCommandExtra = never>(config: TMessagerConfig) => messagerGenerator<C>(Messager, makeCore)(config)
export const createMessagerBroadcastChannelAsync = <C extends TCommandExtra = never>(config: TMessagerConfig) => messagerGeneratorAsync<C>(Messager, makeCorePromise)(config)



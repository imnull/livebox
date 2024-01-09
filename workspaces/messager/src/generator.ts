import { TCommandExtra, TCoreMaker, TCoreMakerAsync, TCoreMessager, TMessagerConfig, TMessagerCoreConfig } from "./type"

import { Messager } from "./base"


export const messagerGenerator = <G extends TMessagerConfig = TMessagerConfig, C extends TCommandExtra = never, T extends Messager<C> = Messager<C>>(C: new (config: G & TMessagerCoreConfig) => T, maker: TCoreMaker<G>) => {
    return (config: G) => {
        const core = maker(config)
        return new C({ ...config, core })
    }
}

export const messagerGeneratorAsync = <G extends TMessagerConfig = TMessagerConfig, C extends TCommandExtra = never, T extends Messager<C> = Messager<C>>(C: new (config: G & TMessagerCoreConfig) => T, maker: TCoreMakerAsync<G>) => {
    return async (config: G) => {
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

export const createMessagerBroadcastChannel = <C extends TCommandExtra = never>(config: TMessagerConfig) => messagerGenerator(Messager<C>, makeCore)(config)
export const createMessagerBroadcastChannelAsync = <C extends TCommandExtra = never>(config: TMessagerConfig) => messagerGeneratorAsync(Messager<C>, makeCorePromise)(config)



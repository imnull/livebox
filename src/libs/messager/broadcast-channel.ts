import { Messager } from "./base"
import type { LiveRequest, LiveRequestClient } from "./base-live"
import type { Room, RoomClient } from "./base-room"
import { TMessagerConfig, TCommandExtra, TCoreMessager } from "./type"
import { generator } from "./generator"

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

/**
 * ### BroadcastChannelMessager
 * Impliment Messager by BroadcastChannel
 */
export class BroadcastChannelMessager<C extends TCommandExtra> extends Messager<C> {
    constructor(config: TMessagerConfig = {}) {
        super({ ...config, core: makeCore(config) })
    }
}


export default generator(makeCore)
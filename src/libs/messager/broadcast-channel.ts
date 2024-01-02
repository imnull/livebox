import { Messager } from "./base"
import { Room, RoomClient } from "./base-room"
import { TMessagerConfig, TCommandExtra, TCoreMessager } from "./type"

const createMessagerCore = (namespace: string): TCoreMessager => {
    const signaling = new BroadcastChannel(namespace)
    return {
        useCallback(cb) {
            signaling.onmessage = (e) => {
                if (!e.data) {
                    return
                }
                cb(e.data)
            }
        },
        poseMessage(data) {
            signaling.postMessage(data)
        }
    }
}

/**
 * ### BroadcastChannelMessager
 * Impliment Messager by BroadcastChannel
 */
export class BroadcastChannelMessager<C extends TCommandExtra> extends Messager<C> {

    constructor(config: TMessagerConfig = {}) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

/**
 * ### BroadcastChannelRoom
 * Impliment Room by BroadcastChannel
 */
export class BroadcastChannelRoom extends Room {
    constructor(config: TMessagerConfig = {}) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

/**
 * ### BroadcastChannelRoom
 * Impliment Room by BroadcastChannel
 */
export class BroadcastChannelRoomClient extends RoomClient {
    constructor(config: TMessagerConfig = {}) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

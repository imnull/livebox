import { Messager } from "./base"
import { LiveRequest } from "./base-live"
import { Room, RoomClient } from "./base-room"
import { TMessagerConfig, TCommandExtra, TCoreMessager, TLiveRequestOptions } from "./type"

const createMessagerCore = (namespace: string): TCoreMessager => {
    const signaling = new BroadcastChannel(namespace)
    return {
        useCallback(cb) {
            signaling.onmessage = (e) => {
                if (!e.data) {
                    return
                }
                console.log('=============>', namespace, e.data.command, e.data.sender, e.data.reciever)
                cb(e.data)
            }
        },
        poseMessage(data) {
            console.log('------------->', namespace, data.command, data.sender, data.reciever)
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
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

/**
 * ### BroadcastChannelRoom
 * Room implimented by BroadcastChannel
 */
export class BroadcastChannelRoom extends Room {
    constructor(config: TMessagerConfig = {}) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

/**
 * ### BroadcastChannelRoomClient
 * RoomClient implimented by BroadcastChannel
 */
export class BroadcastChannelRoomClient extends RoomClient {
    constructor(config: TMessagerConfig = {}) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}

/**
 * ### BroadcastChannelLiveRequest
 * LiveRequest implimented by BroadcastChannel
 */
export class BroadcastChannelLiveRequest extends LiveRequest {
    constructor(config: TMessagerConfig & TLiveRequestOptions) {
        const { namespace = '' } = config
        const core = createMessagerCore(namespace)
        super({ ...config, core })
    }
}
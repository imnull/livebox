import { TCommandExtra, TCommandHello, TCoreMaker, TMessagerConfig } from "./type"

import { Messager } from "./base"
import { LiveRequest, LiveRequestClient } from "./base-live"
import { Room, RoomClient } from "./base-room"

export const generator = (maker: TCoreMaker) => {
    return {
        createMessager: <C extends TCommandExtra = TCommandHello>(conf: TMessagerConfig) => {
            return new Messager<C>({ ...conf, core: maker(conf) })
        },
        createRoom: (conf: TMessagerConfig) => {
            return new Room({ ...conf, core: maker(conf) })
        },
        createRoomClient: (conf: TMessagerConfig) => {
            return new RoomClient({ ...conf, core: maker(conf) })
        },
        createLive: (conf: TMessagerConfig) => {
            return new LiveRequest({ ...conf, core: maker(conf) })
        },
        createLiveClient: (conf: TMessagerConfig) => {
            return new LiveRequestClient({ ...conf, core: maker(conf) })
        },
    }
}
import { TCommandExtra, TCommandHello, TCoreMaker, TCoreMakerAsync, TMessagerConfig } from "./type"

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

// type TGeneratorResult = ReturnType<typeof generator>
// type TGeneratorResultAsync = { [key in keyof TGeneratorResult]: Promise<TGeneratorResult[key]> }

export const generatorPromise = (maker: TCoreMakerAsync) => {
    return {
        createMessager: async <C extends TCommandExtra = TCommandHello>(conf: TMessagerConfig) => {
            const core = await maker(conf)
            return new Messager<C>({ ...conf, core })
        },
        createRoom: async (conf: TMessagerConfig) => {
            const core = await maker(conf)
            return new Room({ ...conf, core })
        },
        createRoomClient: async (conf: TMessagerConfig) => {
            const core = await maker(conf)
            return new RoomClient({ ...conf, core })
        },
        createLive: async (conf: TMessagerConfig) => {
            const core = await maker(conf)
            return new LiveRequest({ ...conf, core })
        },
        createLiveClient: async (conf: TMessagerConfig) => {
            const core = await maker(conf)
            return new LiveRequestClient({ ...conf, core })
        },
    }
}
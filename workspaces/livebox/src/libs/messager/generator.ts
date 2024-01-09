import {
    Messager,
    TCommandExtra, TCoreMaker, TCoreMakerAsync, TMessagerConfig,
    messagerGenerator, messagerGeneratorAsync,
} from "@imnull/messager"

import { LiveRequest, LiveRequestClient } from "./base-live"
import { Room, RoomClient } from "./base-room"

export const generator = (maker: TCoreMaker) => {
    return {
        createMessager: <C extends TCommandExtra = never>(conf: TMessagerConfig) => {
            return messagerGenerator(Messager<C>, maker)(conf)
        },
        createRoom: (conf: TMessagerConfig) => {
            return messagerGenerator(Room, maker)(conf)
        },
        createRoomClient: (conf: TMessagerConfig) => {
            return messagerGenerator(RoomClient, maker)(conf)
        },
        createLive: (conf: TMessagerConfig) => {
            return messagerGenerator(LiveRequest, maker)(conf)
        },
        createLiveClient: (conf: TMessagerConfig) => {
            return messagerGenerator(LiveRequestClient, maker)(conf)
        },
    }
}

// type TGeneratorResult = ReturnType<typeof generator>
// type TGeneratorResultAsync = { [key in keyof TGeneratorResult]: Promise<TGeneratorResult[key]> }

export const generatorPromise = (maker: TCoreMakerAsync) => {
    return {
        createMessager:  <C extends TCommandExtra = never>(conf: TMessagerConfig) => {
            return messagerGeneratorAsync(Messager<C>, maker)(conf)
        },
        createRoom: async (conf: TMessagerConfig) => {
            return messagerGeneratorAsync(Room, maker)(conf)
        },
        createRoomClient: async (conf: TMessagerConfig) => {
            return messagerGeneratorAsync(RoomClient, maker)(conf)
        },
        createLive: async (conf: TMessagerConfig) => {
            return messagerGeneratorAsync(LiveRequest, maker)(conf)
        },
        createLiveClient: async (conf: TMessagerConfig) => {
            return messagerGeneratorAsync(LiveRequestClient, maker)(conf)
        },
    }
}
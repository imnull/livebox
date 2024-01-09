import { TMessage } from '@imnull/messager'

/* ### Chat room types ### */

export type TRoomEnterCommand = {
    command: 'room-user-enter'
    data: {
        nickname: string
        avatar: string
        gender: string
    }
}
export type TRoomEnterOKCommand = {
    command: 'room-user-enter-ok'
    config: {
        id: string
        room: string
    }
}
export type TRoomSayCommand = {
    command: 'room-user-say',
    content: string
    userInfo: { nickname: string; avatar: string; gender: string }
}
export type TRoomLeaveCommand = {
    command: 'room-user-leave'
}

export type TRoomUser = { id: string; nickname: string, avatar: string, gender: string }
export type TRoomMessage = { userId: string; content: string, userInfo: { nickname: string, avatar: string, gender: string } }
export type TRoomUpdateUsers = { command: 'room-update-users', data: TRoomUser[] }
export type TRoomUpdateMessages = { command: 'room-update-messages', data: TRoomMessage[] }

export type TRoomRequestReady = {
    command: 'room-request-live-ready'
}

export type TRoomRequestLive = {
    command: 'room-request-live'
    channel: string
}

export type TRoomResponseLive = {
    command: 'room-response-live'
}

export type TRoomResponseLiveCanPlay = {
    command: 'room-live-canplay'
}

export type TRoomResponseLivePlay = {
    command: 'room-live-play'
}

/* ### Chat room types END ### */

export type TLiveRequestCommandCandidate = {
    command: 'live-request-candidate';
    candidate: RTCIceCandidateInit | null
}
export type TLiveRequestCommandOffer = {
    command: 'live-request-offer';
    offer: RTCSessionDescriptionInit
}
export type TLiveRequestCommandAnswer = {
    command: 'live-request-answer';
    answer: RTCSessionDescriptionInit
}

export type TExtraCommand<M extends { command: string }, C extends M['command']> = M extends { command: C } ? M : never
// type TC = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter'>
// type TC2 = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter-ok'>

export type TMessageCommandNames<T extends { command: string }> = T extends { command: infer C } ? C : never
export type TMessageCommandMap<T extends { command: string }, E extends TMessage = TMessage> = { [key in T['command']]: TExtraCommand<T, key> & E }
export type TMessageCommandCallbackMap<T extends { command: string }, E extends TMessage = TMessage> = { [key in T['command']]?: (msg: TExtraCommand<T, key> & E) => void }

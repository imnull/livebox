export type TMessage = ({
    target: 'public'
} | {
    target: 'group'
    group: string
} | {
    target: 'private'
    reciever: string
})

export type TCommandHello = {
    command: 'hello'
}

export type TMessageInner = {
    sender: string
} & TMessage

export type TCoreMessager<C extends TCommandExtra = TCommandHello> = {
    useCallback: (callback: (data: TMessage & C) => void) => void
    poseMessage: (data: TMessage & C) => void
    close: () => void
}

export type TMessagerCoreConfig<C extends TCommandExtra = TCommandHello>  = {
    core: TCoreMessager<C>
}

export type TMessagerConfig = {
    namespace?: string
    groups?: string[]
    blocks?: string[]
}

export type TCommandExtra = { command: string; data?: any }


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

/* ### Chat room types END ### */


export type TLiveRequestOptions = {
    stream: MediaStream
    reciever: string
}
export type TLiveRequestCommandStart = { command: 'live-request' }
// export type TLiveRequestCommandReady = { command: 'live-request-ready'; sender: string }

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
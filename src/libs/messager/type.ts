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

export type TCoreMessager = {
    useCallback: (callback: (data: any) => void) => void
    poseMessage: (data: any) => void
}

export type TMessagerCoreConfig = {
    core: TCoreMessager
}

export type TMessagerConfig = {
    namespace?: string
    groups?: string[]
    blocks?: string[]
}

export type TCommandExtra = { command: string; data?: any }


export type TRoomEnterCommand = {
    command: 'room-user-enter'
    data: {
        nickname: string
        avatar: string
        gender: string
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
export type TRoomMessage = { userId: string; content: string, userInfo: TRoomUser }
export type TRoomUpdateUsers = { command: 'room-update-users', data: TRoomUser[] }
export type TRoomUpdateMessages = { command: 'room-update-messages', data: TRoomMessage[] }


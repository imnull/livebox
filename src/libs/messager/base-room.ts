import { Messager } from "./base"
import {
    TMessagerConfig, TRoomEnterCommand, TRoomLeaveCommand, TRoomMessage, TRoomSayCommand,
    TRoomUser, TRoomUpdateUsers, TRoomUpdateMessages, TMessagerCoreConfig, TRoomEnterOKCommand,
} from "./type"

type TRoomRequestLive = {
    command: 'room-request-live'
}

type TRoomResponseLive = {
    command: 'room-response-live'
    channel: string
}

type TRoomCommand = TRoomEnterCommand | TRoomEnterOKCommand | TRoomSayCommand
    | TRoomLeaveCommand | TRoomUpdateUsers | TRoomUpdateMessages
    | TRoomRequestLive | TRoomResponseLive

export class Room extends Messager<TRoomCommand> {
    private readonly users: TRoomUser[]
    private readonly messages: TRoomMessage[]

    constructor(config: TMessagerConfig & TMessagerCoreConfig) {
        super(config)
        this.users = []
        this.messages = []
        this.initRoom()
    }
    protected initRoom() {
        this.on<TRoomEnterCommand>('room-user-enter', msg => {
            const idx = this.users.findIndex(u => u.id === msg.sender)
            if (idx < 0) {
                this.users.push({ id: msg.sender, ...msg.data })
                this.onUsersUpdate([...this.users])
                this.send({ target: 'public', command: 'room-update-users', data: [...this.users] })
                this.send({ target: 'private', reciever: msg.sender, command: 'room-update-users', data: [...this.users] })
            } else {
            }
            this.send({ target: 'private', reciever: msg.sender, command: 'room-update-messages', data: [...this.messages] })
        })
        this.on<TRoomLeaveCommand>('room-user-leave', msg => {
            const idx = this.users.findIndex(u => u.id === msg.sender)
            if (idx > -1) {
                this.users.splice(idx, 1)
                this.onUsersUpdate([...this.users])
                this.send({ target: 'public', command: 'room-update-users', data: [...this.users] })
            }
        })
        this.on<TRoomSayCommand>('room-user-say', msg => {
            this.messages.push({ userId: msg.sender, content: msg.content, userInfo: msg.userInfo })
            this.onMessagesUpdate([...this.messages])
            this.send({ target: 'public', command: 'room-update-messages', data: [...this.messages] })
        })
        this.on<TRoomRequestLive>('room-request-live', msg => {
            this.send({
                target: 'private',
                reciever: msg.sender,
                command: 'room-response-live',
                channel: msg.sender
            })
        })
    }

    onUsersUpdate(users: TRoomUser[]) {
        console.log('Room users:', users)
    }
    onMessagesUpdate(messages: TRoomMessage[]) {
        console.log('Room messages:', messages)
    }
}

export class RoomClient extends Messager<TRoomCommand> {

    enterRoom(info: {
        nickname: string
        avatar: string
        gender: string
    }) {
        const { nickname, avatar, gender } = info
        this.send({
            target: 'public',
            command: 'room-user-enter',
            data: {
                nickname,
                avatar,
                gender
            }
        })
    }

    enter() {
        const nickname = '', avatar = '', gender = ''
        this.send({
            target: 'public',
            command: 'room-user-enter',
            data: {
                nickname,
                avatar,
                gender
            }
        })
    }

    requestLive() {
        console.log(9999999999, 'requestLive')
        this.send({
            target: 'public',
            command: 'room-request-live',
        })
    }

    leaveRoom() {
        this.send({
            target: 'public',
            command: 'room-user-leave'
        })
    }

    say(info: {
        content: string
        nickname: string
        avatar: string
        gender: string
    }) {
        const { content, nickname, avatar, gender } = info
        this.send({
            target: 'public',
            command: 'room-user-say',
            content,
            userInfo: { nickname, avatar, gender }
        })
    }

    protected init() {
        super.init()
        this.on<TRoomUpdateUsers>('room-update-users', msg => {
            this.onUsersUpdate(msg.data)
        })
        this.on<TRoomUpdateMessages>('room-update-messages', msg => {
            this.onMessagesUpdate(msg.data)
        })
    }

    onUsersUpdate(users: TRoomUser[]) {
        console.log('RoomClient users:', users)
    }
    onMessagesUpdate(messages: TRoomMessage[]) {
        console.log('RoomClient messages:', messages)
    }
}
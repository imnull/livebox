import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { BroadcastChannelRoomClient, RoomClient } from '~/libs/messager'
import { TRoomMessage, TRoomUser } from '~/libs/messager/type'

import { ChatArea, MessageInput } from '~/components'

import '~/pages/chat-room.scss'

export default () => {

    const { name } = useParams()

    const [info, setInfo] = useState<{ nickname: string; avatar: string; gender: string } | null>(null)
    const [users, setUsers] = useState<TRoomUser[]>([])
    const [msgs, setMsgs] = useState<TRoomMessage[]>([])
    const [msg, setMsg] = useState<RoomClient | null>(null)

    const [nickname, setNickname] = useState('')
    const [avatar, setAvatar] = useState('')
    const [gender, setGender] = useState('unknown')

    useEffect(() => {
        const msg = new BroadcastChannelRoomClient({ namespace: name })
        setMsg(msg)

        const unload = () => {
            msg.leaveRoom()
        }
        window.addEventListener('unload', unload)

        return () => {
            // msg.leaveRoom()
        }

    }, [])

    useEffect(() => {
        if (!msg || !info) {
            return
        }
        msg.onUsersUpdate = setUsers
        msg.onMessagesUpdate = setMsgs
        msg.enterRoom(info)

    }, [msg, info])

    if (msg) {
        if (info) {
            return <div className='chat-room'>
                <h1>RoomClient {name}</h1>
                <ChatArea messager={msg} messages={msgs} users={users} />
                <MessageInput messager={msg} userInfo={{ nickname, gender, avatar }} />
            </div>
        } else {
            return <div className='chat-room'>
                <div className='row'>
                    <div className='label'>Nickname:</div>
                    <input value={nickname} placeholder='nickname' onChange={e => setNickname(e.target.value)} />
                </div>
                <div className='row'>
                    <div className='label'>Gender:</div>
                    <select value={gender} onChange={e => setGender(e.target.value)}>
                        <option>unknown</option>
                        <option>male</option>
                        <option>female</option>
                    </select>
                </div>
                <button disabled={!nickname} onClick={() => {
                    setInfo({ nickname, gender, avatar })
                }}>Enter room</button>
            </div>
        }
    } else {
        return null
    }
}
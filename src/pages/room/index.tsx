import { useEffect, useState } from 'react'
import { BroadcastChannelRoom } from '~/libs/messager'
import { TRoomMessage, TRoomUser } from '~/libs/messager/type'

import { useParams } from 'react-router-dom'

import '~/pages/chat-room.scss'

export default () => {

    const [users, setUsers] = useState<TRoomUser[]>([])
    const [msgs, setMsgs] = useState<TRoomMessage[]>([])
    const { name = '' } = useParams()

    useEffect(() => {
        const msg = new BroadcastChannelRoom({ namespace: name })
        msg.onUsersUpdate = setUsers
        msg.onMessagesUpdate = setMsgs
    }, [])


    return <div className='chat-room'>
        <h1>Room</h1>
        <div className='chat-area'>
            <div className='messages'>{
                msgs.map((msg, idx) => {
                    return <div className='item' key={idx}>
                        <div className='content'>{msg.content}</div>
                    </div>
                })
            }</div>
            <div className='users'>{
                users.map(user => {
                    return <div className='item' key={user.id}>{user.nickname}</div>
                })
            }</div>
        </div>
    </div>
}
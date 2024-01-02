import { useEffect, useState } from "react"
import { ChatMessage } from "./message"
import { TRoomMessage, TRoomUser } from "~/libs/messager/type"
import type { Messager } from "~/libs/messager"
import { RoomUser } from "./room-user"

export const ChatArea = (props: {
    messager: Messager<any>
    messages: TRoomMessage[]
    users: TRoomUser[]
}) => {

    const {
        messager,
        messages, users
    } = props

    const [msgdom, setMsgdom] = useState<HTMLElement | null>(null)

    useEffect(() => {

        if(!msgdom) {
            return
        }
        const y = msgdom.scrollHeight
        msgdom.scrollTo(0, y)

    }, [msgdom, messages])

    return <div className='chat-area'>
        <div className='messages' ref={setMsgdom}>{
            messages.map((m, idx) => {
                return <ChatMessage key={idx} content={m.content} me={m.userId === messager.getIdentity()} user={m.userInfo} />
            })
        }</div>
        <div className='users'>{
            users.map(user => {
                return <div className='item' key={user.id}>
                    <RoomUser user={user} />
                </div>
            })
        }</div>
    </div>
}
import { TRoomUser } from "~/libs/messager/type"
import { RoomUser } from "./room-user"
import { ChatContent } from "./chat-content"
import { findUser } from "./utils"

export const ChatMessage = (props: {
    me?: boolean
    user?: TRoomUser
    content?: string
}) => {
    const { me = false, user = {}, content = '' } = props
    return <div className={`chat-message ${me ? 'me' : ''}`}>
        <div className="user-wrapper">
            <RoomUser user={user} me={me} avatarOnly />
        </div>
        <ChatContent nickname={(user as any).nickname || ''} content={content} me={me} />
    </div>
}
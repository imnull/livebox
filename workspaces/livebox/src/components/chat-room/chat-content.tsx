export const ChatContent = (props: {
    content: string
    nickname: string
    me?: boolean
}) => {
    const { content, me = false, nickname } = props
    return <div className={`chat-content ${me ? 'me' : ''}`}>
        <div className="nickname">{nickname}</div>
        <div className="content">{content}</div>
    </div>
}
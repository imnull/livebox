export const RoomUser = (props: {
    user?: { nickname?: string; avatar?: string; gender?: string }
    me?: boolean
    avatarOnly?: boolean
}) => {
    const { user = {}, me = false, avatarOnly = false } = props
    return <div className={`room-user ${me ? 'me' : ''}`}>
        <div className={`gender ${user.gender}`}></div>
        {avatarOnly ? null : <div className='nickname'>{user.nickname}</div>}
    </div>
}


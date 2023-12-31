import { useEffect, useState } from 'react'
import { LiveMain } from '~/components'
import { LOCAL_CHANNEL } from '~/config'
import { LiveMessagerRoom } from '~/libs/live-messager'
import { PeerMedia } from '~/libs/peer-media'

export default () => {

    const [m, setM] = useState<LiveMessagerRoom | null>(null)
    const [c, setC] = useState('')

    useEffect(() => {
        const m = new LiveMessagerRoom(LOCAL_CHANNEL)
        setM(m)

        m.on('request-live', ({ from }) => {
            const member = m.getMember(from)
            if (!member) {
                return
            }
            const { live_channel } = member
            const peer = new PeerMedia({ channel: live_channel })
            console.log(77777, live_channel)
            setC('live_channel')
        })
    }, [])

    return <div className="video-container">
        <LiveMain channel={c} />
    </div>
}
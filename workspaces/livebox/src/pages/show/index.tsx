import { useEffect, useState } from 'react'
import { LOCAL_CHANNEL } from '~/config'
import { LiveMessagerClient } from '~/libs/live-messager'
import { LivePlayer } from '~/components'

export default () => {
    const [m, setM] = useState<LiveMessagerClient | null>(null)
    const [c, setC] = useState('')

    useEffect(() => {
        const m = new LiveMessagerClient(LOCAL_CHANNEL)
        setM(m)

        m.on('enter', ({ data }) => {
            setTimeout(() => {
                m.requestLive()
            }, 1000)
            setC('live_channel')
        })
        m.enterRoom()
    }, [])

    return <div className="video-container">
        <LivePlayer channel={c} />
    </div>
}
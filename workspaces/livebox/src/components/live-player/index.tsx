import { useEffect, useState } from "react"
import { MSG } from '~/libs/messager'
import { genId } from "~/utils"

import './index.scss'
import { TRoomRequestLive, TRoomRequestReady, TRoomResponseLivePlay } from "~/libs/messager/type"

export default (props: {
    channel?: string
}) => {

    const { channel } = props
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)
    const [liveChannel, setLiveChannel] = useState(`live_${genId()}`)

    useEffect(() => {

        if (!liveChannel || !video || !channel) {
            return
        }
        MSG.createMessager<
            TRoomRequestReady | TRoomResponseLivePlay | TRoomRequestLive
        >({ namespace: channel, uri: 'ws://localhost:3213/livebox' }).then(async messager => {

            messager.regist({
                'room-request-live-ready': () => {
                    setLiveChannel(`live_${genId()}`)
                },
                'room-live-play': msg => {
                    video.play()
                }
            })

            const client = await MSG.createLiveClient({ namespace: liveChannel, uri: 'ws://localhost:3213/livebox' })
            client.onTrack = stream => {
                video.srcObject = stream
            }

            messager.send({
                target: 'public',
                command: 'room-request-live',
                channel: liveChannel,
            })
        })
        
    }, [liveChannel, video, channel])

    if (!channel) {
        return <div className="live-room">
            <h1>no channel params</h1>
        </div>
    }

    return <div className="live-player-container">
        <video className="live-player" muted ref={setVideo} autoPlay />
    </div>
}
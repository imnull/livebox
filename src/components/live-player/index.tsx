import { useEffect, useState } from "react"
import { BroadcastChannel } from '~/libs/messager'
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
        const messager = BroadcastChannel.createMessager<TRoomRequestReady | TRoomResponseLivePlay | TRoomRequestLive>({ namespace: channel })
        messager.regist({
            'room-request-live-ready': () => {
                setLiveChannel(`live_${genId()}`)
            },
            'room-live-play': msg => {
                video.play()
            }
        })

        messager.send({
            target: 'public',
            command: 'room-request-live',
            channel: liveChannel,
        })

        const client = BroadcastChannel.createLiveClient({ namespace: liveChannel })
        client.onTrack = stream => {
            console.log(2222222, stream)
            video.srcObject = stream
        }

        return () => {
            client.close()
            messager.close()
        }
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
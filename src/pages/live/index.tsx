import { useEffect, useState } from "react"
import { useParams } from "react-router"
import type { RoomClient, LiveRequestClient } from '~/libs/messager'
import { BroadcastChannel } from '~/libs/messager'


export default (props: {}) => {
    const { channel } = useParams()
    const [msg, setMsg] = useState<RoomClient | null>(null)
    const [liveClient, setLiveClient] = useState<LiveRequestClient | null>(null)

    const [video, setVideo] = useState<HTMLVideoElement | null>(null)


    useEffect(() => {
        if (!channel) {
            return
        }
    }, [channel])

    useEffect(() => {
        if (!msg || !liveClient) {
            return
        }
        msg.requestLive(liveClient.getIdentity())
    }, [msg, liveClient])

    useEffect(() => {

        if(!video) {
            return
        }

        video.oncanplay = () => {
            // video.play()
            console.log(2222222, video)
        }

        video.onload = () => {
            console.log(111111, video)
        }

        const msg = BroadcastChannel.createRoomClient({ namespace: channel })
        const liveClient = BroadcastChannel.createLiveClient({ namespace: msg.getIdentity() })
        liveClient.onTrack = stream => {
            video.srcObject = stream
            // video.play()
        }
        setMsg(msg)
        setLiveClient(liveClient)
        return () => {
            msg.leaveRoom()
            msg.close()
            liveClient.close()
        }
    }, [video])

    return <div className="live-room">
        <h1>LiveRoom: {channel}</h1>
        <video className="live-player" ref={setVideo} autoPlay controls />
    </div>
}
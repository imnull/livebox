import { useEffect, useState } from "react"
import { PeerMedia, getUserMedia } from "~/libs/peer-media"
import { LOCAL_CHANNEL } from "~/config"

export default (props: {
    channel: string
}) => {
    const { channel = '' } = props
    const [v, setV] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (!v || !channel) {
            return
        }
        console.log(111111, channel)
        const m = new PeerMedia({ channel })
        m.onTrack = remoteStream => {
            v.srcObject = remoteStream
        }

    }, [v, channel])

    return <div className="livebox live-player">
        <video
            className="video"
            autoPlay
            ref={setV}
        />
        <div className="btns">

        </div>
    </div>
}
import { useEffect, useState } from "react"
import { PeerMedia, getUserMedia } from "~/libs/peer-media"
import { LOCAL_CHANNEL } from "~/config"

export default () => {
    const [v, setV] = useState<HTMLVideoElement | null>(null)
    const [m, setM] = useState<PeerMedia | null>(null)

    useEffect(() => {
        if (!v) {
            return
        }
        const m = new PeerMedia({ channel: LOCAL_CHANNEL })
        m.onTrack = remoteStream => {
            v.srcObject = remoteStream
        }
        setM(m)
    }, [v])

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
import { useEffect, useState } from "react"
import { PeerMedia, getUserMedia } from "~/libs/peer-media"
import { LOCAL_CHANNEL } from "~/config"

export default () => {
    const [v, setV] = useState<HTMLVideoElement | null>(null)
    const [m, setM] = useState<PeerMedia | null>(null)
    const [callin, setCallIn] = useState(false)

    useEffect(() => {
        if (!v) {
            return
        }
        const m = new PeerMedia({ channel: LOCAL_CHANNEL })
        m.onTrack = remoteStream => {
            v.srcObject = remoteStream
        }
        m.onCallIn = () => {
            setCallIn(true)
        }

        setM(m)

    }, [v])

    return <div className="live-local">
        <video
            autoPlay
            controls
            ref={setV}
        />
        <div className="btns">
            <button disabled={!m || !callin} onClick={() => {
                m!.acceptCall()
                setCallIn(false)
            }}>Accept</button>
            <button disabled={!m || !callin} onClick={() => {
                m!.acceptCall()
                setCallIn(false)
            }}>HangUp</button>
        </div>
    </div>
}
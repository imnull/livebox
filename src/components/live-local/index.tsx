import { useEffect, useState } from "react"
import { PeerMedia, getUserMedia } from "~/libs/peer-media"
import { LOCAL_CHANNEL } from "~/config"

export default () => {
    const [v, setV] = useState<HTMLVideoElement | null>(null)
    const [m, setM] = useState<PeerMedia | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if(!v) {
            return
        }
        getUserMedia().then(stream => {
            v.srcObject = stream
            const m = new PeerMedia({ channel: LOCAL_CHANNEL })
            m.setStream(stream)
            setM(m)
        })
    }, [v])

    useEffect(() => {
        if(!m) {
            return
        }

    }, [m])

    return <div className="live-local">
        <video
            autoPlay
            ref={setV}
            onCanPlay={() => {
                setReady(true)
            }}
        />
        <div className="btns">
            <button disabled={!m || !ready} onClick={() => {
                console.log(m)
                m!.call()
                setReady(false)
            }}>Call</button>
            <button disabled={!m || ready} onClick={() => {
                setReady(false)
                m!.dispose()
            }}>Hang Up</button>
        </div>
    </div>
}
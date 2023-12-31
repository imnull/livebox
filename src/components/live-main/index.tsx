import { useEffect, useState } from "react"
import { PeerMedia, getUserMedia } from "~/libs/peer-media"
import { LOCAL_CHANNEL } from "~/config"

import { CanvasRandom, VideoPort } from '~/components'

export default (props: {
    channel: string
}) => {
    const { channel } = props
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)
    const [m, setM] = useState<PeerMedia | null>(null)
    const [canPlay, setCanPlay] = useState(false)

    useEffect(() => {
        if(!video || !channel) {
            return
        }
        getUserMedia().then(stream => {
            video.srcObject = stream
            const m = new PeerMedia({ channel })
            m.push(stream)
            setM(m)
        })
    }, [video, channel])


    return <div className="livebox live-main">
        <div className="screens">
            {/* <video
                className={`video ${canPlay ? '' : 'waiting'}`}
                autoPlay
                ref={setVideo}
                onCanPlay={() => {
                    setCanPlay(true)
                }}
            /> */}
            <VideoPort onReady={setVideo} />
            <CanvasRandom onReady={setCanvas} />
        </div>
        <div className="btns">
            <button onClick={() => {
                if(!m || !video) {
                    return
                }
                getUserMedia().then(stream => {
                    video.srcObject = stream
                    m.push(stream)
                    setM(m)
                })
            }}>Camera</button>
            <button disabled={!m || !canvas} onClick={() => {
                if(!m) {
                    return
                }
                const stream = canvas!.captureStream()
                m.push(stream)
                setM(m)
            }}>Canvas</button>
        </div>
    </div>
}
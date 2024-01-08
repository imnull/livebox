import { useEffect, useState } from "react"
import { getUserMedia } from "~/libs/peer-media"

export default (props: {
    // onReady: (stream: MediaStream) => void
    onReady: (video: HTMLVideoElement) => void
}) => {

    const { onReady } = props

    const [video, setVideo] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if(!video) {
            return
        }
        if(typeof onReady === 'function') {
            onReady(video)
        }
        // getUserMedia().then(stream => {
        //     video.srcObject = stream
        //     if(typeof onReady === 'function') {
        //         onReady(stream)
        //     }
        // }, err => {
        //     console.log('local-camera error:', err)
        // })
    }, [video])
    return <div className="video-port">
        <video autoPlay width={480} height={360} ref={setVideo} />
    </div>
}
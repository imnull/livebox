import { useEffect, useState } from "react"

import './index.scss'

export default (props: {
    mini?: boolean
    onReady?: (canvas: MediaStream | null) => void
}) => {
    const { mini = false, onReady } = props
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!video || !stream) {
            return
        }
        video.srcObject = stream
    }, [video, stream])

    useEffect(() => {
        typeof onReady === 'function' && onReady(stream || null)
    }, [stream, onReady])

    // useEffect(() => {
    //     navigator.mediaDevices.getDisplayMedia({ audio: false, video: true }).then(stream => {
    //         setStream(stream)
    //     }, (err: any) => {
    //         setError(String(err))
    //     })
    // }, [])

    const changeCapture = () => {
        navigator.mediaDevices.getDisplayMedia({ audio: false, video: true }).then(stream => {
            setStream(stream)
            setError('')
        }, (err: any) => {
            setStream(null)
            setError(String(err))
        })
    }


    return <div className={`stream-capture-screen ${mini ? 'mini' : ''}`} onClick={changeCapture}>
        {error ? <span className="error">{error}</span> : <video autoPlay ref={setVideo} />}
    </div>
}
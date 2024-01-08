import { useEffect, useState } from "react"

export default (props: {
    onReady?: (local: HTMLVideoElement, remote: HTMLVideoElement) => void
}) => {

    const { onReady } = props

    const [local, setV1] = useState<HTMLVideoElement | null>(null)
    const [remote, setV2] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (local && remote && typeof onReady === 'function') {
            onReady(local, remote)
        }
    }, [local, remote])

    return <div className="video2">
        <video autoPlay controls ref={setV1} />
        <video autoPlay controls ref={setV2} />
    </div>
}
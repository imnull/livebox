import { useEffect, useState } from "react"

import './index.scss'

type TAnimater = {
    start: () => void
    stop: (cb?: { (): void }) => void
}

const createAnimater = (cb: () => void): TAnimater => {
    let status = 0

    let onstop: { (): void } | undefined
    let h: any

    const loop = () => {
        if (status === 2) {
            status = 0
            if (typeof onstop === 'function') {
                onstop()
            }
            return
        }
        cb()
        h = requestAnimationFrame(loop)
    }

    const R = {
        start: () => {
            if (status !== 0) {
                return
            }
            status = 1
            loop()
        },
        stop: (cb?: { (): void }) => {
            onstop = cb
            cancelAnimationFrame(h)
            status = 2
        }
    }
    return R
}

const calContainRect = (w: number, h: number, W: number, H: number) => {
    const r = w / h
    const R = W / H
    if (r > R) {
        const _w = W
        const _h = _w / r
        return [0, (H - _h) / 2, _w, _h]
    } else {
        const _h = H
        const _w = _h * r
        return [(W - _w) / 2, 0, _w, _h]
    }
}

const createPainter = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return () => { }
    }
    return () => {
        const rect = calContainRect(video.videoWidth, video.videoHeight, canvas.width, canvas.height)
        if (rect.some(v => isNaN(v))) {
            return
        }
        const [x, y, w, h] = rect
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(video, x, y, w, h)
    }
}

const drawNoSign = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('No Sign', canvas.width / 2, canvas.height / 2.2)
    ctx.font = 'bold 28px arial'
    ctx.fillText((new Date()).toString(), canvas.width / 2, canvas.height / 1.8)
}

export default (props: {
    mini?: boolean
    stream?: MediaStream | null
    onReady?: (canvas: MediaStream) => void
}) => {
    const { stream, onReady, mini = false } = props
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)
    const [ani, setAni] = useState<TAnimater | null>(null)

    useEffect(() => {
        if (!canvas) {
            return
        }
        if (typeof onReady === 'function') {
            const stream = canvas.captureStream(30)
            onReady(stream)
        }
    }, [canvas])

    useEffect(() => {
        if (!canvas || !video) {
            return
        }

        if (!stream) {
            const painter = () => drawNoSign(canvas)
            const ani = createAnimater(painter)
            setAni(ani)
        } else {
            video.muted = true
            // video.onloadedmetadata = (e) => {
            //     if(!ani) {
            //         const painter = createPainter(canvas, video)
            //         const ani = createAnimater(painter)
            //         setAni(ani)
            //         ani.start()
            //     } else {
            //         ani.start()
            //     }
            // }
            video.oncanplay = () => {
                video.play()
            }
            video.srcObject = stream
            const painter = createPainter(canvas, video)
            const ani = createAnimater(painter)
            setAni(ani)
        }
    }, [video, canvas, stream])

    useEffect(() => {
        if (!ani) {
            return
        }
        ani.start()
        return () => {
            ani.stop()
        }
    }, [ani])


    return <div className={`stream-bus-container ${mini ? 'mini' : ''}`}>
        <canvas ref={setCanvas} width={1920} height={1080} />
        <video style={{ width: 0, height: 0 }} ref={setVideo} />
    </div>
}
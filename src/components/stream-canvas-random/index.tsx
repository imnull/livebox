import { useEffect, useState } from "react"
import "./index.scss"

export default (props: {
    fillColor?: string
    mini?: boolean
    onReady?: (canvas: MediaStream) => void
}) => {

    const { onReady, fillColor = 'yellow', mini = false } = props

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [animate, setAnimate] = useState<any>(null)

    useEffect(() => {
        if (!canvas) {
            return
        }
        typeof onReady === 'function' && onReady(canvas.captureStream())
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        const animate = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#333'
            ctx.fillRect(60, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#555'
            ctx.fillRect(120, 0, canvas.width, canvas.height)
            ctx.fillStyle = fillColor
            ctx.font = 'bold 32px serif'
            ctx.fillText((new Date()).toString(), -230, 120)
            ctx.fillText((new Date()).toString(), -30, 220)
            ctx.fillText(Date.now().toString(), 130, 320)
        }, 100)
        setAnimate(animate)
    }, [canvas])

    useEffect(() => {
        return () => {
            clearInterval(animate)
        }
    }, [])

    return <div className={`canvas-random-container ${mini ? 'mini' : ''}`}>
        <canvas width={480} height={360} ref={setCanvas} />
    </div>
}
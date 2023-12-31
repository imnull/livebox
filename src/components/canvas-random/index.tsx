import { useEffect, useState } from "react"

export default (props: {
    onReady?: (canvas: HTMLCanvasElement) => void
}) => {

    const { onReady } = props

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [animate, setAnimate] = useState<any>(null)

    useEffect(() => {
        if(!canvas) {
            return
        }
        typeof onReady === 'function' && onReady(canvas)
        const ctx = canvas.getContext('2d')
        if(!ctx) {
            return
        }
        
        const animate = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#333'
            ctx.fillRect(60, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#555'
            ctx.fillRect(120, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'yellow'
            ctx.font = 'bold 32px serif'
            ctx.fillText((new Date()).toString(), 30, 220)
        }, 100)
        setAnimate(animate)
    }, [canvas])

    useEffect(() => {
        return () => {
            clearInterval(animate)
        }
    }, [])

    return <div className="canvas-random">
        <canvas width={480} height={360} ref={setCanvas} />
    </div>
}
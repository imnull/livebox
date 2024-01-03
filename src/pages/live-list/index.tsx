import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { StreamCanvasRandom, StreamLocalCamera, StreamCaptureScreen, StreamBus } from '~/components'
import { LiveMain } from '~/components'
import { Button } from 'antd'

import './index.scss'

const CHANNEL01 = 'channel01'

const replaceStream = (from: MediaStream, to: MediaStream) => {
    to.getTracks().forEach(track => {
        to.removeTrack(track)
    })
    from.getTracks().forEach(track => {
        to.addTrack(track)
    })
}

const cloneStream = (stream: MediaStream) => {
    const ms = new MediaStream()
    stream.getTracks().forEach(track => {
        ms.addTrack(track)
    })
    return ms
}

export default () => {

    const [current, setCurrent] = useState(0)
    const [s0, setS0] = useState<MediaStream | null>(null)
    const [s1, setS1] = useState<MediaStream | null>(null)
    const [s2, setS2] = useState<MediaStream | null>(null)
    const [s3, setS3] = useState<MediaStream | null>(null)
    const [main, setMain] = useState<MediaStream | null>(null)

    useEffect(() => {
        const from = [s0, s1, s2, s3][current]
        if (!from) {
            setMain(null)
            return
        }
        // replaceStream(from, main)
        setMain(cloneStream(from))

    }, [current, s0, s1, s2, s3])



    return <div className='live-list-container'>
        <h1>Live Room - main</h1>
        <div className='live-panel'>
            <div className='list'>
                <div className='item'>
                    <StreamCanvasRandom onReady={setS0} mini fillColor='yellow' />
                    <Button size='large' style={{ margin: 5 }} disabled={current === 0} onClick={() => setCurrent(0)}>切换</Button>
                </div>
                <div className='item'>
                    <StreamCaptureScreen onReady={setS1} mini />
                    <Button size='large' style={{ margin: 5 }} disabled={current === 1} onClick={() => setCurrent(1)}>切换</Button>
                </div>
                <div className='item'>
                    <StreamLocalCamera onReady={setS2} mini />
                    <Button size='large' style={{ margin: 5 }} disabled={current === 2} onClick={() => setCurrent(2)}>切换</Button>
                </div>
                <div className='item'>
                    <StreamCanvasRandom onReady={setS3} mini fillColor='blue' />
                    <Button size='large' style={{ margin: 5 }} disabled={current === 3} onClick={() => setCurrent(3)}>切换</Button>
                </div>
            </div>
            <div className='monitor'>
                <LiveMain channel={CHANNEL01} stream={main} />
                <NavLink target='_blank' to={`/live/${CHANNEL01}`}>Go Channel01</NavLink>
            </div>
        </div>
    </div>
}
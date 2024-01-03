import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CanvasRandom } from '~/components'
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

    const [main, setMain] = useState(new MediaStream())

    useEffect(() => {
        const from = [s0, s1, s2][current]
        if(!from) {
            return
        }
        // replaceStream(from, main)
        setMain(cloneStream(from))
        
    }, [current, s0, s1, s2])

    const ss = [s0, s1, s2]

    return <div className='live-list-container'>
        <h1>LiveList</h1>
        <div className='live-panel'>
            <div className='list'>
                <div className='item'>
                    <CanvasRandom onReady={setS0} mini fillColor='yellow' />
                    <Button size='large' style={{ margin: 5 }}  disabled={current === 0} onClick={() => setCurrent(0)}>切换</Button>
                </div>
                <div className='item'>
                    <CanvasRandom onReady={setS1} mini fillColor='blue' />
                    <Button size='large' style={{ margin: 5 }} disabled={current === 1} onClick={() => setCurrent(1)}>切换</Button>
                </div>
                <div className='item'>
                    <CanvasRandom onReady={setS2} mini fillColor='red' />
                    <Button size='large' style={{ margin: 5 }}  disabled={current === 2} onClick={() => setCurrent(2)}>切换</Button>
                </div>
            </div>
            <div className='monitor'>
                <LiveMain channel={CHANNEL01} stream={main} />
                <NavLink target='_blank' to={`/live/${CHANNEL01}`}>Go Channel01</NavLink>
            </div>
        </div>
    </div>
}
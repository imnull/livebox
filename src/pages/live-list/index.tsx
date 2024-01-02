import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CanvasRandom } from '~/components'
import { BroadcastChannelRoom, BroadcastChannelLiveRequest } from '~/libs/messager'

import '~/pages/live-room.scss'

const CHANNEL01 = 'channel01'

export default () => {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [stream01, setStream01] = useState<MediaStream | null>(null)
    const [room01, setRoom01] = useState<BroadcastChannelRoom | null>(null)

    const [streamHash, setStreamHash] = useState<Record<string, BroadcastChannelLiveRequest>>({})

    useEffect(() => {
        if (!canvas) {
            return
        }
        setStream01(canvas.captureStream())
    }, [canvas])

    useEffect(() => {
        if (!stream01) {
            setRoom01(null)
            return
        }
        const room01 = new BroadcastChannelRoom({ namespace: CHANNEL01 })
        
        setRoom01(room01)

        return () => {
            console.log(7777777, room01)
            room01.close()
        }

    }, [stream01])

    useEffect(() => {
        if(!room01 || !stream01) {
            return
        }


        room01.on('room-request-live', msg => {
            console.log(`11111111111111---------22222`)
            const reciever = msg.sender
            // const { [reciever]: oldSt } = streams01
            // if (oldSt) {
            //     oldSt.close()
            // }

            // const newSt = new BroadcastChannelLiveRequest({ namespace: reciever, stream: stream01, reciever })
            // setStreams01({ ...streams01, [reciever]: newSt })
            // newSt.play()

            console.log(333333, reciever)
            room01.send({
                target: 'private',
                reciever: reciever,
                command: 'room-response-live',
                channel: reciever
            })
        })

        
    }, [stream01, room01])

    useEffect(() => {
        return () => {
            room01 && room01.close()
        }
    }, [room01])



    return <div className='live-list'>
        <h1>LiveList</h1>
        <div className='list'>
            <div className='item'>
                <CanvasRandom onReady={setCanvas} />
                <NavLink to={`/live/${CHANNEL01}`}>Go Channel01</NavLink>
            </div>
        </div>
    </div>
}
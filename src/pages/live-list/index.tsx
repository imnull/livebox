import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CanvasRandom } from '~/components'
import { Room, LiveRequest } from '~/libs/messager'
import { BroadcastChannel } from '~/libs/messager'

import '~/pages/live-room.scss'

const CHANNEL01 = 'channel01'

export default () => {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [stream01, setStream01] = useState<MediaStream | null>(null)
    const [room01, setRoom01] = useState<Room | null>(null)

    const [streamHash, setStreamHash] = useState<Record<string, LiveRequest>>({})

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
        const room01 = BroadcastChannel.createRoom({ namespace: CHANNEL01 })

        setRoom01(room01)

        return () => {
            console.log(7777777, room01)
            room01.close()
        }

    }, [stream01])

    useEffect(() => {
        if (!room01 || !stream01) {
            return
        }

        room01.regist({
            'room-request-live': msg => {
                const reciever = msg.sender
                const channel = msg.channel
                
                const { [reciever]: oldSt } = streamHash
                if (oldSt) {
                    oldSt.close()
                }

                const newSt = BroadcastChannel.createLive({ namespace: reciever })
                newSt.append(stream01)
                setStreamHash({ ...streamHash, [reciever]: newSt })

                room01.send({
                    target: 'private',
                    reciever: msg.sender,
                    command: 'room-response-live',
                    channel: channel
                })

            }
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
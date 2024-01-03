import { useEffect, useState } from 'react'
import { LiveRequest } from '~/libs/messager'
import { BroadcastChannel } from '~/libs/messager'
import { TRoomRequestLive, TRoomRequestReady, TRoomResponseLive, TRoomResponseLiveCanPlay, TRoomResponseLivePlay } from '~/libs/messager/type'

import './index.scss'

export default (props: {
    channel?: string
    stream?: MediaStream | null
    update?: number
    onCreateLive?: (info: { channel: string; sender: string; connection: LiveRequest }) => void
}) => {

    const { channel, stream, onCreateLive, update = Date.now() } = props
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (!channel || !stream) {
            return
        }

        const messager = BroadcastChannel.createMessager<TRoomResponseLiveCanPlay | TRoomRequestLive | TRoomResponseLive | TRoomRequestReady | TRoomResponseLivePlay>({ namespace: channel })
        messager.regist({
            'room-live-canplay': msg => {
                messager.send({
                    target: 'private',
                    reciever: msg.sender,
                    command: 'room-live-play'
                })
            },
            'room-request-live': msg => {
                const connection = BroadcastChannel.createLive({ namespace: msg.channel })
                connection.append(stream)

                if (typeof onCreateLive === 'function') {
                    onCreateLive({
                        sender: msg.sender,
                        channel: msg.channel,
                        connection,
                    })
                }
                messager.send({
                    target: 'private',
                    reciever: msg.sender,
                    command: 'room-response-live',
                })
            }
        })
        messager.send({
            target: 'public',
            command: 'room-request-live-ready'
        })


        return () => {
            messager.close()
        }

    }, [channel, stream])

    useEffect(() => {
        if (!stream || !video) {
            return
        }
        video.srcObject = stream
    }, [stream, video])

    if (!channel || !stream) {
        return <div className='live-main'>
            <h1>No data</h1>
        </div>
    }

    return <div className='live-main-container'>
        <video muted autoPlay ref={setVideo} />
    </div>
}
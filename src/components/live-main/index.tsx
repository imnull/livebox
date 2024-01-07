import { useEffect, useState } from 'react'
import { LiveRequest } from '~/libs/messager'
import { BroadcastChannel } from '~/libs/messager'
import { TRoomRequestLive, TRoomRequestReady, TRoomResponseLive, TRoomResponseLiveCanPlay, TRoomResponseLivePlay } from '~/libs/messager/type'

import { StreamBus } from '~/components'

import './index.scss'

export default (props: {
    channel?: string
    stream?: MediaStream | null
    update?: number
    onCreateLive?: (info: { channel: string; sender: string; connection: LiveRequest }) => void
}) => {

    const { channel, stream, onCreateLive, update = Date.now() } = props
    const [output, setOutput] = useState<MediaStream | null>(null)

    useEffect(() => {
        if (!channel || !output) {
            return
        }

        BroadcastChannel.createMessager<
            TRoomResponseLiveCanPlay | TRoomRequestLive | TRoomResponseLive | TRoomRequestReady | TRoomResponseLivePlay
        >({ namespace: channel }).then(messager => {
            messager.regist({
                'room-live-canplay': msg => {
                    messager.send({
                        target: 'private',
                        reciever: msg.sender,
                        command: 'room-live-play'
                    })
                },
                'room-request-live': msg => {
                    BroadcastChannel.createLive({ namespace: msg.channel }).then(connection => {
                        connection.append(output)
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
                    })
                }
            })
            messager.send({
                target: 'public',
                command: 'room-request-live-ready'
            })
        })

    }, [channel, output])

    if (!channel) {
        return <div className='live-main-container'>
            <h1>No channel</h1>
        </div>
    }

    return <div className='live-main-container'>
        <StreamBus stream={stream} mini onReady={setOutput} />
    </div>
}
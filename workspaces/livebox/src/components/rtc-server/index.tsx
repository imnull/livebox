import { useCallback, useEffect, useState } from "react"
import CONFIG from '~/config'

import {
    TMessager, TLiveCommands, TMessage,
    createWSMessagerAsync as createMessagerAsync,
} from '@imnull/msglite'



export default (props: {
    showTitle?: boolean
    channel: string
    url?: string
    stream?: MediaStream | null
}) => {

    const { showTitle = true, channel, url, stream: _stream } = props

    const [player, setPlayer] = useState<HTMLVideoElement | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [messager, setMessager] = useState<TMessager<TLiveCommands> | null>(null)

    useEffect(() => {
        if(!player) {
            return
        }
        if(_stream) {
            player.srcObject = _stream
        } else if(url) {
            player.src = url
        }

    }, [player, url, _stream])

    const queue: Record<string, RTCPeerConnection> = {}

    const onLiveAnswer = useCallback((msg: any) => {
        const { answer, sender } = msg
        const { [sender]: peer } = queue
        if (!peer) {
            return
        }
        peer.setRemoteDescription(answer)
    }, [queue])

    const onLiveRequest = useCallback(async (msg: TMessage) => {
        if (!stream || !messager) {
            return
        }
        const { [msg.sender]: oldPeer } = queue
        if (oldPeer) {
            oldPeer.close()
        }
        const peer = new RTCPeerConnection({ iceServers: CONFIG.ICE_SERVERS })
        peer.onicecandidate = ev => {
            let _candidate: any = null
            if (!ev.candidate) {
                messager.send({
                    target: 'private',
                    receiver: msg.sender,
                    command: 'live-candidate',
                    candidate: _candidate
                })
            } else {
                const { candidate, sdpMLineIndex, sdpMid } = ev.candidate
                _candidate = { candidate }
                _candidate.sdpMLineIndex = sdpMLineIndex || 0
                _candidate.sdpMid = sdpMid || ''
                messager.send({
                    target: 'private',
                    receiver: msg.sender,
                    command: 'live-candidate',
                    candidate: _candidate
                })
            }
        }
        stream.getTracks().forEach(track => {
            peer.addTrack(track)
        })
        const offer = await peer.createOffer()
        peer.setLocalDescription(offer)
        const { sdp } = offer
        messager.send({
            target: 'private',
            receiver: msg.sender,
            command: 'live-offer',
            offer: { type: 'offer', sdp },
        })
        queue[msg.sender] = peer

        console.log('queue', queue)
    }, [stream, messager, queue])

    useEffect(() => {
        if (!messager) {
            return
        }
        messager.on({
            'live-answer': onLiveAnswer,
            'live-request': onLiveRequest,
            'live-exit': msg => {
            }
        })

        messager.send({
            command: 'live-ready'
        })

    }, [messager])

    useEffect(() => {
        if (!stream) {
            return
        }
        createMessagerAsync<TLiveCommands>(channel, CONFIG.WS_URL).then(setMessager)
    }, [stream])



    return <div className="rtc-client-container">
        {showTitle ? <h3>RTC-SERVER</h3> : null}
        <video muted autoPlay loop ref={setPlayer} crossOrigin="anonymous" onCanPlay={e => {
            const S = (e.target as HTMLCanvasElement).captureStream()
            setStream(S)
        }} />
    </div>
}
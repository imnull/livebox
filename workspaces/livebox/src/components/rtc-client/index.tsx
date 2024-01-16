import { useCallback, useEffect, useState } from "react"
import CONFIG from '~/config'
import {
    TMessager, TLiveCommands, TMessage,
    createWSMessagerAsync as createMessagerAsync,
} from '@imnull/msglite'



export default (props: {
    channel: string
    onTrack?: (stream: MediaStream) => void
}) => {

    const { channel, onTrack } = props

    const [remoteVideo, setRemoteVideo] = useState<HTMLVideoElement | null>(null)
    const [messager, setMessager] = useState<TMessager<TLiveCommands> | null>(null)
    const [peer, setPeer] = useState<RTCPeerConnection | null>(null)
    const [playing, setPlaying] = useState(false)

    const createPeer = useCallback(() => {
        const peer = new RTCPeerConnection({ iceServers: CONFIG.ICE_SERVERS })
        peer.ontrack = ev => {
            console.log('onTrack =>>>>>>>>>>>', ev);
            let stream: MediaStream | null = null
            if (Array.isArray(ev.streams) && ev.streams.length > 0) {
                stream = ev.streams[0]
            } else if (ev.track) {
                stream = new MediaStream()
                stream.addTrack(ev.track)
            }
            if (stream) {
                if (typeof onTrack === 'function') {
                    onTrack(stream)
                }
                if(remoteVideo) {
                    remoteVideo.srcObject = stream
                }
            }
        }
        return peer
    }, [remoteVideo, onTrack])

    const onLiveReady = useCallback((msg: TMessage) => {
        if(!messager) {
            return
        }
        if (peer && peer.connectionState !== 'closed') {
            peer.close()
        }
        setPeer(createPeer())
        console.log(222222222, msg)
        messager.send({
            target: 'private',
            receiver: msg.sender,
            command: 'live-request'
        })
    }, [peer, messager])

    const onLiveOffer = useCallback(async (data: any) => {
        if(!messager || !peer) {
            return
        }
       
        const { offer } = data
        peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        try {
            await peer.setLocalDescription(answer)
        } catch(ex) {
            console.log(5555555, ex)
        }

        const { sdp } = answer

        messager.send({
            target: 'private',
            receiver: data.sender,
            command: 'live-answer',
            answer: { type: 'answer', sdp }
        })
    }, [peer, messager])

    const onLiveCandidate = useCallback((data: any) => {
        if(!peer) {
            return
        }
        const { candidate } = data
        if (candidate) {
            peer.addIceCandidate(candidate)
        } else {
            peer.addIceCandidate()
        }
    }, [peer])

    useEffect(() => {
        if(!messager) {
            return
        }

        if(!peer) {
            setPeer(createPeer())
        }

        messager.on({
            'live-ready': onLiveReady,
            'live-offer': onLiveOffer,
            'live-candidate': onLiveCandidate,
        })
    }, [peer, messager])

    useEffect(() => {
        if (!remoteVideo) {
            return
        }
        const users: any[] = []
        createMessagerAsync<TLiveCommands>(channel, CONFIG.WS_URL).then(m => {
            setMessager(m)
            users.push(m)
        })
        
    }, [remoteVideo])

    useEffect(() => {
        return () => {
            if(messager) {
                messager.send({
                    command: 'live-exit'
                })
            }
        }
    }, [])


    return <div className="rtc-client-container">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <h3>RTC-CLIENT [{channel}]</h3>
            <button disabled={!messager || playing} style={{ marginLeft: 10 }} onClick={() => {
                if(messager) {
                    messager.send({
                        command: 'live-request'
                    })
                }
            }}>Call</button>
        </div>
        <video muted autoPlay ref={setRemoteVideo} onCanPlay={() => {
            setPlaying(true)
        }} />
    </div>
}
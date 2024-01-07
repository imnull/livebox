import { RTCPeerConnectionConfig } from "./index"
import { Messager } from "./base"
import {
    TLiveRequestCommandAnswer, TLiveRequestCommandCandidate, TLiveRequestCommandOffer,
    TMessagerConfig, TMessagerCoreConfig,
} from "./type"

export class LiveRequest extends Messager<
    TLiveRequestCommandCandidate | TLiveRequestCommandOffer | TLiveRequestCommandAnswer
> {

    private readonly peerConn: RTCPeerConnection

    constructor(config: TMessagerConfig & TMessagerCoreConfig) {
        super(config)
        this.peerConn = new RTCPeerConnection(RTCPeerConnectionConfig)
        this.initRTCPeerConnection()
    }

    private initRTCPeerConnection() {
        const peerConn = this.peerConn

        peerConn.onicecandidate = e => {
            let _candidate: TLiveRequestCommandCandidate['candidate'] | null = null
            if (e.candidate) {
                const { candidate, sdpMid, sdpMLineIndex } = e.candidate
                _candidate = { candidate, sdpMid, sdpMLineIndex }
            }
            this.send({
                target: 'public',
                command: 'live-request-candidate',
                candidate: _candidate
            })
        }

        this.regist({
            'live-request-candidate': async msg => {
                if (!msg.candidate) {
                    await this.peerConn.addIceCandidate()
                } else {
                    await this.peerConn.addIceCandidate(msg.candidate)
                }
            },
            'live-request-answer': async msg => {
                await peerConn.setRemoteDescription(msg.answer)
            },
        })
    }

    public close() {
        super.close()
        this.peerConn.close()
    }

    private async offer() {
        const offer = await this.peerConn.createOffer()
        const { sdp, type } = offer
        await this.peerConn.setLocalDescription(offer)
        this.send({
            target: 'public',
            command: 'live-request-offer',
            offer: { sdp, type }
        })
    }

    async append(stream: MediaStream) {
        stream.getTracks().forEach(track => {
            this.peerConn.addTrack(track)
        })
        await this.offer()
    }
}

export class LiveRequestClient extends Messager<
    TLiveRequestCommandCandidate | TLiveRequestCommandOffer | TLiveRequestCommandAnswer
> {

    private readonly peerConn: RTCPeerConnection

    constructor(config: TMessagerConfig & TMessagerCoreConfig) {
        super(config)
        this.peerConn = new RTCPeerConnection(RTCPeerConnectionConfig)
        this.initRTCPeerConnection()
    }

    onTrack(stream: MediaStream) {
        console.log('LiveRequestClient onTrack:', stream)
    }

    private initRTCPeerConnection() {
        const peerConn = this.peerConn
        peerConn.ontrack = e => {
            if (e.streams && e.streams.length > 0) {
                const media = e.streams[0]
                typeof this.onTrack === 'function' && this.onTrack(media)
            } else if (e.track) {
                const media = new MediaStream()
                media.addTrack(e.track)
                typeof this.onTrack === 'function' && this.onTrack(media)
            }
        }

        this.regist({
            'live-request-candidate': async msg => {
                if (!msg.candidate) {
                    await this.peerConn.addIceCandidate()
                } else {
                    await this.peerConn.addIceCandidate(msg.candidate)
                }
            },
            'live-request-offer': async msg => {
                await this.answer(msg.offer)
            },
        })
    }

    public close() {
        super.close()
        this.peerConn.close()
    }

    private async answer(offer: RTCSessionDescriptionInit) {
        await this.peerConn.setRemoteDescription(offer)
        const answer = await this.peerConn.createAnswer()
        const { sdp, type } = answer
        await this.peerConn.setLocalDescription(answer)
        this.send({
            target: 'public',
            command: 'live-request-answer',
            answer: { sdp, type }
        })
    }
}
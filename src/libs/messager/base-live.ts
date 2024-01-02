import { Messager } from "./base"
import { TLiveRequestCommandAnswer, TLiveRequestCommandCandidate, TLiveRequestCommandOffer, TLiveRequestOptions, TMessagerConfig, TMessagerCoreConfig } from "./type"

export class LiveRequest extends Messager<
    TLiveRequestCommandCandidate | TLiveRequestCommandOffer | TLiveRequestCommandAnswer
> {

    private readonly stream: MediaStream
    private readonly peerConn: RTCPeerConnection
    private readonly reciever: string

    constructor(config: TMessagerConfig & TMessagerCoreConfig & TLiveRequestOptions) {
        super(config)

        const { stream, reciever } = config

        this.stream = stream
        this.reciever = reciever
        this.peerConn = new RTCPeerConnection()

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
                target: 'private',
                reciever: this.reciever,
                command: 'live-request-candidate',
                candidate: _candidate
            })
        }

        // this.on<TLiveRequestCommandReady>('live-request-ready', msg => {

        // })

        // this.on<TLiveRequestCommandStart>('live-request-start', msg => {

        // })

        this.on<TLiveRequestCommandCandidate>('live-request-candidate', msg => {
            if (!msg.candidate) {
                this.peerConn.addIceCandidate()
            } else {
                this.peerConn.addIceCandidate(msg.candidate)
            }
        })

        this.on<TLiveRequestCommandOffer>('live-request-offer', msg => {
            this.answer(msg.offer)
        })

        this.on<TLiveRequestCommandAnswer>('live-request-answer', msg => {
            peerConn.setRemoteDescription(msg.answer)
        })
    }

    public getReciever() {
        return this.reciever
    }

    public close() {
        super.close()
        this.peerConn.close()
    }

    public async play() {
        this.stream.getTracks().forEach(track => {
            this.peerConn.addTrack(track)
        })
        await this.offer()
    }

    private async offer() {
        const offer = await this.peerConn.createOffer()
        const { sdp, type } = offer
        await this.peerConn.setLocalDescription(offer)
        this.send({
            target: 'private',
            reciever: this.reciever,
            command: 'live-request-offer',
            offer: { sdp, type }
        })
    }

    private async answer(offer: RTCSessionDescriptionInit) {
        await this.peerConn.setRemoteDescription(offer)
        const answer = await this.peerConn.createAnswer()
        const { sdp, type } = answer
        await this.peerConn.setLocalDescription(answer)
        this.send({
            target: 'private',
            reciever: this.reciever,
            command: 'live-request-answer',
            answer: { sdp, type }
        })
    }
}

export class LiveRequestClient extends Messager<
    TLiveRequestCommandCandidate | TLiveRequestCommandOffer | TLiveRequestCommandAnswer
> {

    private readonly peerConn: RTCPeerConnection
    private readonly reciever: string

    constructor(config: TMessagerConfig & TMessagerCoreConfig & TLiveRequestOptions) {
        super(config)

        const { reciever } = config

        this.reciever = reciever
        this.peerConn = new RTCPeerConnection()

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
                target: 'private',
                reciever: this.reciever,
                command: 'live-request-candidate',
                candidate: _candidate
            })
        }

        this.on<TLiveRequestCommandCandidate>('live-request-candidate', msg => {
            if (!msg.candidate) {
                this.peerConn.addIceCandidate()
            } else {
                this.peerConn.addIceCandidate(msg.candidate)
            }
        })

        this.on<TLiveRequestCommandOffer>('live-request-offer', msg => {
            this.answer(msg.offer)
        })

        this.on<TLiveRequestCommandAnswer>('live-request-answer', msg => {
            peerConn.setRemoteDescription(msg.answer)
        })
    }

    public getReciever() {
        return this.reciever
    }

    public close() {
        super.close()
        this.peerConn.close()
    }


    // private async offer() {
    //     const offer = await this.peerConn.createOffer()
    //     const { sdp, type } = offer
    //     await this.peerConn.setLocalDescription(offer)
    //     this.send({
    //         target: 'private',
    //         reciever: this.reciever,
    //         command: 'live-request-offer',
    //         offer: { sdp, type }
    //     })
    // }

    private async answer(offer: RTCSessionDescriptionInit) {
        await this.peerConn.setRemoteDescription(offer)
        const answer = await this.peerConn.createAnswer()
        const { sdp, type } = answer
        await this.peerConn.setLocalDescription(answer)
        this.send({
            target: 'private',
            reciever: this.reciever,
            command: 'live-request-answer',
            answer: { sdp, type }
        })
    }
}
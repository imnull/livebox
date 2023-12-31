import { TMessager, BroadcastChannelMessager } from '~/libs/signaling'

type TPeerMediaOptions = {
    channel: string
}

export class PeerMedia {
    protected readonly messager: TMessager
    protected readonly peerConn: RTCPeerConnection

    public onTrack?: (track: MediaStream) => void
    public onCallIn?: () => void

    private stream: MediaStream | null

    constructor(options: TPeerMediaOptions) {

        this.stream = null

        this.peerConn = new RTCPeerConnection()
        this.initPeerConnection()

        this.messager = new BroadcastChannelMessager(options.channel)
        this.initMessager()
    }

    protected initPeerConnection() {
        this.peerConn.ontrack = e => {
            if(typeof this.onTrack === 'function') {
                if(Array.isArray(e.streams) && e.streams.length > 0) {
                    this.onTrack(e.streams[0])
                } else if(e.track) {
                    const media = new MediaStream()
                    media.addTrack(e.track)
                    this.onTrack(media)
                } else {
                    return null
                }
            }
        }

        this.peerConn.onicecandidate = e => {
            const msg: any = {
                type: 'candidate',
                candidate: null,
            }
            if (e.candidate) {
                msg.candidate = e.candidate.candidate;
                msg.sdpMid = e.candidate.sdpMid;
                msg.sdpMLineIndex = e.candidate.sdpMLineIndex;
            }
            this.messager.emit(msg)
        }
    }

    protected initMessager() {
        this.messager.on('candidate', candidate => {
            if (!candidate.candidate) {
                this.peerConn.addIceCandidate()
            } else {
                this.peerConn.addIceCandidate(candidate)
            }
        })

        this.messager.on('offer', async offer => {
            await this.peerConn.setRemoteDescription(offer)
            const answer = await this.peerConn.createAnswer()
            await this.peerConn.setLocalDescription(answer)

            this.messager.emit({ type: 'answer', sdp: answer.sdp })
        })

        this.messager.on('answer', answer => {
            this.peerConn.setRemoteDescription(answer)
        })

        this.messager.on('call-accept', () => {
            this.connect()
        })

        this.messager.on('call', () => {
            typeof this.onCallIn === 'function' && this.onCallIn()
        })
    }
    
    // setStream(stream: MediaStream) {
    //     this.stream = stream
    //     stream.getTracks().forEach(track => {
    //         this.peerConn.addTrack(track)
    //     })
    // }

    // acceptCall() {
    //     this.messager.emit({ type: 'call-accept' })
    // }

    // call() {
    //     this.messager.emit({
    //         type: 'call'
    //     })
    // }

    async push(stream: MediaStream) {
        stream.getTracks().forEach(track => {
            this.peerConn.addTrack(track)
        })
        const offer = await this.peerConn.createOffer()
        await this.peerConn.setLocalDescription(offer)
        this.messager.emit({
            type: 'offer',
            sdp: offer.sdp
        })
    }

    dispose() {
        if(this.peerConn) {
            this.peerConn.close();
        }
        if(this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export const getUserMedia = async () => {
    const streamObj = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    return streamObj
}
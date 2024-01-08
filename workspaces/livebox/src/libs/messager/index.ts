export type { LiveRequest, LiveRequestClient } from './base-live'
export type { Room, RoomClient } from './base-room'
export type { Messager } from './base'

import { default as BroadcastChannel } from './broadcast-channel'
import { default as WS } from './websocket'

export { BroadcastChannel, WS, BroadcastChannel as MSG }

export const RTCPeerConnectionConfig = {
    iceServers: [
        // {
        //     urls: 'turn:127.0.0.1:3478',
        //     username: 'username',
        //     credential: 'password',
        // },
        // {
        //     urls: [
        //         // "stun.l.google.com:19302",
        //         // "stun1.l.google.com:19302",
        //         // "stun2.l.google.com:19302",
        //         // "stun3.l.google.com:19302",
        //         // "stun4.l.google.com:19302",
        //         // "stun.ekiga.net",
        //         // "stun.ideasip.com",
        //         // "stun.schlund.de",
        //         // "stun.stunprotocol.org:3478",
        //         // "stun.voiparound.com",
        //         // "stun.voipbuster.com",
        //         // "stun.voipstunt.com",
        //         // "stun.voxgratia.org"
        //     ]
        // }
    ],
}
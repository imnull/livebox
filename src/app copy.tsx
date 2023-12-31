import './app.scss'

import Learn01 from '~/pages/learn01'
import { BroadcastChannelMessager } from '~/libs/signaling'
import {
    PeerMedia, getUserMedia,
} from '~/libs/peer-media'

import { LiveLocal, LiveRemote, LivePlayer, LiveMain } from '~/components'
import { LOCAL_CHANNEL } from './config'

export default () => {
    return <>
        <h1>WebRTC</h1>
        <div className="video-container">
            <LiveMain />
            <LivePlayer />
        </div>
        {/* <Learn01
            onReady={async (local, remote) => {
                const channel = LOCAL_CHANNEL
                const client = new PeerMedia({ channel })
                const server = new PeerMedia({ channel })

                const localStream = await getUserMedia()
                client.setStream(localStream)
                local.srcObject = localStream
                client.call()

                server.onTrack = remoteStream => {
                    console.log(1111111)
                    remote.srcObject = remoteStream
                }
            }}
        /> */}
    </>
}
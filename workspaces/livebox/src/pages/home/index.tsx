import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { RtcClient, RtcServer } from '~/components'

export default () => {

    const [stream, setStream] = useState<MediaStream | null>(null)
    const [remoteVideo, setRemoteVideo] = useState<HTMLVideoElement | null>(null)

    const channel = 'channel-test'
   

    return <>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <h1>HOME</h1>
            <NavLink style={{ marginLeft: 10 }} target='_blank' to={`/live-client/${channel}`}>Go live-client</NavLink>
        </div>
        <RtcServer channel={channel} url="https://webrtc.github.io/samples/src/video/chrome.mp4"></RtcServer>
        {/* <RtcClient channel={channel} /> */}
    </>
}
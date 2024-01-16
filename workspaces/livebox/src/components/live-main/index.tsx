import { RtcServer } from '~/components'

import './index.scss'

export default (props: {
    channel: string
    stream?: MediaStream | null
}) => {

    const { channel, stream } = props
    

    return <div className='live-main-container'>
        <RtcServer showTitle={false} channel={channel} stream={stream} />
    </div>
}
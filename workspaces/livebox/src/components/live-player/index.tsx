import './index.scss'
import { RtcClient } from '~/components'

export default (props: {
    channel: string
}) => {

    const { channel } = props

    return <div className="live-player-container">
        <RtcClient channel={channel} />
    </div>
}
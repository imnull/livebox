import { RtcClient, RtcServer } from '~/components'
import { useParams } from 'react-router'

export default () => {

    const { channel } = useParams()

    return <>
        <h1>HOME</h1>
        {channel ? <RtcClient channel={channel} /> : null}
    </>
}
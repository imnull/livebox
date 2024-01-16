import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { LivePlayer } from '~/components'


export default (props: {}) => {

    const { channel } = useParams()
    return <div className="live-room">
        {channel ? <LivePlayer channel={channel} /> : null}
    </div>
}
import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { LivePlayer } from '~/components'


export default (props: {}) => {

    const { channel } = useParams()
    return <div className="live-room">
        <h1>LiveRoom: {channel}</h1>
        <LivePlayer channel={channel} />
    </div>
}
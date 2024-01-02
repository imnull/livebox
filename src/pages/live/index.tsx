import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { BroadcastChannelRoomClient } from '~/libs/messager'


export default (props: {}) => {
    const { channel } = useParams()
    const [msg, setMsg] = useState<BroadcastChannelRoomClient | null>(null)


    useEffect(() => {
        if(!channel) {
            return
        }
    }, [channel])

    useEffect(() => {
        console.log(444444444, msg)
        if(!msg) {
            return
        }
        // msg.enter()
        msg.requestLive()
    }, [msg])

    useEffect(() => {
        console.log(2222222, channel)
        const msg = new BroadcastChannelRoomClient({ namespace: channel })
        msg.on('room-response-live', msg => {
            console.log(333333, msg)
        })
        setMsg(msg)
        return () => {
            msg.leaveRoom()
            msg.close()
        }
    }, [])

    return <div className="live-room">
        <h1>LiveRoom: {channel}</h1>
    </div>
}
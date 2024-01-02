import { useEffect } from 'react'
import { BroadcastChannelMessager } from '~/libs/messager'

export default () => {

    useEffect(() => {
        const msg = new BroadcastChannelMessager({ namespace: 'webrtc1' })
        msg.on('hello', msg => {
            console.log(11111, msg)
        })
        msg.send({
            target: 'public',
            command: 'hello'
        })
    }, [])

    return <h1>Home</h1>
}
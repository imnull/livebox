import { useEffect } from 'react'
import { BroadcastChannel } from '~/libs/messager'

export default () => {

    useEffect(() => {
        BroadcastChannel.createMessager({ namespace: 'webrtc1' }).then(msg => {
            msg.regist({
                hello: msg => {
                    console.log(11111, msg)
                }
            })
            msg.send({
                target: 'public',
                command: 'hello'
            })
        })
    }, [])

    return <h1>Home</h1>
}
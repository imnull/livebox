import { useCallback, useEffect, useState } from "react"
import { Messager, RoomClient } from "~/libs/messager"
import { Input, Button } from 'antd'

export const MessageInput = (props: {
    messager: RoomClient
    userInfo: { nickname: string; avatar: string; gender: string }
}) => {

    const { messager, userInfo } = props

    const [value, setValue] = useState('')

    const keyup = useCallback((e: KeyboardEvent) => {
        if(e.key === 'Enter') {
            messager.say({
                content: value,
                ...userInfo
            })
            setValue('')
        }
    }, [value])
    
    useEffect(() => {
        window.addEventListener('keyup', keyup)
        return () => {
            window.removeEventListener('keyup', keyup)
        }
    }, [keyup])

    return <div className='message-input'>
        <Input value={value} accessKey="" onInput={e => {
            setValue((e.target as any).value)
        }} showCount maxLength={70} style={{ resize: 'none', marginRight: 10 }} />
        <Button disabled={!value} onClick={() => {
            messager.say({
                content: value,
                ...userInfo
            })
            setValue('')
        }}>Send</Button>
    </div>
}
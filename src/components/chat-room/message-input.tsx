import { useCallback, useEffect, useState } from "react"
import { Messager } from "~/libs/messager"
import { Input, Button } from 'antd'

export const MessageInput = (props: {
    messager: Messager<any>
}) => {

    const { messager } = props

    const [value, setValue] = useState('')

    const keyup = useCallback((e: KeyboardEvent) => {
        if(e.key === 'Enter') {
            messager.send({
                target: 'public',
                command: 'room-user-say',
                content: value
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
            messager.send({
                target: 'public',
                command: 'room-user-say',
                content: value
            })
            setValue('')
        }}>Send</Button>
    </div>
}
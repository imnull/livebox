import { TMessagerCore } from './type'
import Messager from './messager'
import { genId } from './utils'


const createBroadcastChannelCore = <C extends { command: string } = any>(channel: string): TMessagerCore<C> => {
    const chn = new BroadcastChannel(channel)
    let callback: any = null
    chn.onmessage = ev => {
        if (!ev.data || typeof callback !== 'function') {
            return
        }
        callback(ev.data)
    }
    return {
        post(msg) {
            chn.postMessage(msg)
        },
        listen(cb) {
            callback = cb
        },
        close() {
            chn.close()
        }
    }
}

export const createBCMessager = <C extends { command: string } = any>(channel: string) => {
    const core = createBroadcastChannelCore<C>(channel)
    return new Messager<C>(core)
}

export const createBCMessagerAsync = <C extends { command: string } = any>(channel: string, ...args: any[]): Promise<Messager<C>> => new Promise((resolve, reject) => {
    setTimeout(() => {
        const msgr = createBCMessager<C>(channel)
        resolve(msgr)
    }, Math.random() * 1000)
})

const createWebsocketCoreAsync = <C extends { command: string } = any>(channel: string, url: string): Promise<TMessagerCore<C>> => new Promise((resolve, reject) => {
    const chn = new WebSocket(url)
    let callback: any = null

    const socketid = genId()
    
    const prodEvent = (ev: MessageEvent<any>) => {
        let obj = ev.data
        if (typeof obj === 'string') {
            try {
                obj = JSON.parse(obj)
            } catch (ex) {
                obj = null
            }
        }
        if (!obj || typeof callback !== 'function') {
            return
        }
        console.log('WS client capture:', obj)
        callback(obj)
    }

    const initEvent = (ev: MessageEvent<any>) => {
        if(!ev.data) {
            return
        }
        try {
            const data = JSON.parse(ev.data + '')
            if(data.command === 'websocket-regist-ok') {
                chn.removeEventListener('message', initEvent)
                chn.addEventListener('message', prodEvent)

                resolve({
                    post(msg) {
                        const data = { ...msg, namespace: channel }
                        console.log('WS Client emit:', data)
                        chn.send(JSON.stringify(data))
                    },
                    listen(cb) {
                        callback = cb
                    },
                    close() {
                        chn.close()
                    },
                    identity: socketid
                })
            } else {
                reject(data)
            }
        } catch(ex) {
            console.log('regist socket error:', ev.data, ex)
            reject(ex)
        }
    }

    chn.addEventListener('message', initEvent)
    chn.addEventListener('open', () => {
        chn.send(JSON.stringify({
            command: 'websocket-regist',
            namespace: channel,
            socketid,
        }))
    })
    chn.addEventListener('error', err => {
        reject(err)
    })
})

export const createWSMessagerAsync = async <C extends { command: string } = any>(channel: string, url: string): Promise<Messager<C>> => {
    const core = await createWebsocketCoreAsync<C>(channel, url)
    return new Messager<C>(core)
}

export type TLiveCommands = {
    command: 'live-offer'
    offer: { sdp?: string; type: 'offer' }
} | {
    command: 'live-answer'
    answer: { sdp?: string; type: 'answer' }
} | {
    command: 'live-candidate',
    candidate: {
        candidate: string
        sdpMLineIndex: number | null
        sdpMid: string | null
    } | null
} | {
    command: 'live-ready'
} | {
    command: 'live-request'
} | {
    command: 'live-exit'
}

// export { createBCMessagerAsync as createMessagerAsync }
// export { createWSMessagerAsync as createMessagerAsync }

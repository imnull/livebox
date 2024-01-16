import WebSocket from "ws"
import { WS_PATH } from './config'
import { cluster, createMessager } from './messager'

const wss = new WebSocket.Server({ noServer: true, path: WS_PATH })

const tryParseJSON = (val: any) => {
    if(typeof val === 'string') {
        try {
            return JSON.parse(val)
        } catch(ex) {
            return null
        }
    } else {
        return val
    }
}

wss.on('connection', ws => {
    console.log('Add one connection:', ws.url);
    ws.on('message', msg => {
        const txt = msg.toString('utf-8')
        const data = tryParseJSON(txt)
        if(!data) {
            return
        }
        // console.log(111111, data)
        const { command, namespace, socketid } = data
        if(!namespace) {
            return
        }
        if(command === 'websocket-regist') {
            const msg = createMessager({ namespace, ws, socketid })
            cluster.regist(msg)
            ws.send(JSON.stringify({ namespace, command: 'websocket-regist-ok' }))
        } else {
            cluster.emit(data)
        }
    });
})

export default wss
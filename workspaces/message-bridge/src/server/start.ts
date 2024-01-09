import http from 'http'
import app from './app'
import wss from './wss'

import { HTTP_PORT, WS_PATH } from './config'

const server = http.createServer(app.callback())
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request)
    })
})

server.listen(HTTP_PORT, () => {
    console.log(`HTTP Server start at:`, `http://localhost:${HTTP_PORT}`)
    console.log(`WS Server start at:`, `ws://localhost:${HTTP_PORT}${WS_PATH}`)
})
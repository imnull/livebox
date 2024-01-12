import Koa from 'koa'
import KoaRouter from 'koa-router'
import * as CONFIG from './config'

const app = new Koa()
const route = new KoaRouter()

route.get('/', async ctx => {
    ctx.body = 'Hello Message Server'
})

route.get('/config', async ctx => {
    ctx.body = JSON.stringify(CONFIG)
    ctx.type = 'json'
})

app.use(route.routes())

export default app
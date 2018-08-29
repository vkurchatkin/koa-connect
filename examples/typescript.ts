import { IncomingMessage, ServerResponse } from "http";
import Koa = require('koa')
import c2k = require('../index')

function middleware (req: {}, res: {}, next: (err?: any) => void) {
  console.log('connect')
  next()
}

const app = new Koa()
app.use(c2k(middleware))

app.use((ctx: Koa.Context) => {
  ctx.body = 'koa'
})

app.listen(3000)

var koa = require('koa')
var c2k = require('..')
var app = koa()

function middleware (req, res, next) {
  console.log('connect')
  next()
}

app.use(c2k(middleware))
app.use(function (next) {
  return function * () {
    this.body = 'koa'
    yield next
  }
})

app.listen(3000)
var koa = require('koa')
var connect = require('connect')
var c2k = require('..')
var app = koa()


app.use(c2k(connect.logger('dev')))
app.use(c2k(connect.cookieParser()))
app.use(c2k(connect.cookieSession({ secret: 'keyboard cat'})))

app.use(function (next) {
  return function * () {
    var name = this.req.session.name = this.query.name || this.req.session.name
    this.body = name || 'Please, enter your name'
    yield next
  }
})

app.listen(3000)
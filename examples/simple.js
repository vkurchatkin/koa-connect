var koa = require('koa');
var c2k = require('..');
var app = koa();

function middleware (req, res, next) {
  console.log('connect');
  next();
}

app.use(c2k(middleware));

app.use(function * () {
  this.body = 'koa';
});

app.listen(3000);

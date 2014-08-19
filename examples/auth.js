var koa = require('koa');
var connect = require('connect');
var c2k = require('..');
var app = koa();


app.use(c2k(connect.logger('dev')));
app.use(c2k(connect.basicAuth('username', 'password')));

app.use(function * () {
  this.body = 'Hello';
});

app.listen(3000);

var koa = require('koa');
var connect = require('connect');
var c2k = require('..');
var app = koa();


app.use(c2k(connect.logger('dev')));
app.use(c2k(connect.directory(__dirname)));
app.use(c2k(connect.static(__dirname)));


app.use(function * () {
  this.body = 'koa'
  yield next
});

app.listen(3000);

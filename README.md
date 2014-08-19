# koa-connect

Use connect and express middleware in koa

# Install

```bash
npm install koa-connect
```

# Usage:

```javascript
var koa = require('koa');
var c2k = require('koa-connect');
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
```


# License

MIT
# koa-connect

Use [Connect](https://github.com/senchalabs/connect)/[Express](https://github.com/strongloop/express) middleware with Koa.

It is highly recommended to use Koa middlewares over Connect versions when they're available. That said, this module is a workaround for when that's not an option, and also to remove the need for library authors to write 2 versions of a middleware for their library.

# Installation

```bash
npm install koa-connect
```

**Note:** Requires a `Promise` implementation to be installed, either native or polyfilled.

# Usage
See `examples/` for more real-world examples, or `test/` for some spec examples.

```javascript
const Koa = require('koa');
const c2k = require('koa-connect');
const app = new Koa();

function connectMiddlware (req, res, next) {
  console.log('connect');
  next();
}

app.use(c2k(connectMiddlware));

app.use(function * () {
  this.body = 'koa';
});

app.listen(3000);
```


# Testing
Tests are in the `test/` directory and are made with the [Mocha](https://mochajs.org) framework. You can run them with `npm test` or `npm run test:watch`

# License

MIT

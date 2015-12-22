# koa-connect

Use [Connect](https://github.com/senchalabs/connect)/[Express](https://github.com/strongloop/express) middleware with Koa.

It is highly recommended to use Koa middlewares over Connect versions when they're available. That said, this module is a workaround for when that's not an option, and also to remove the need for library authors to write 2 versions of a middleware for their library.

# Installation

```sh
npm install koa-connect
```

# Usage
See `examples/` for more real-world examples.

```javascript
const Koa = require('koa');
const connect = require('koa-connect');

// A generic Connect middleware function
function connectMiddlware (req, res, next) {
  next();
}

const app = new Koa();

// ES6
app.use((ctx, next) => {
  next()
    .then(() => {
      // The control flow will bubble back to here, like usual
    })
    .catch((err) => {
      // Error handling from downstream middleware, like usual
    })
});

// ES7
app.use( async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // Normal error handling
  }
  // Normal control flow
});

app.use(connect(connectMiddlware));

app.use((ctx, next) => {
  // As long as `next` is called in the Connect middleware
  ctx.body = 'It will continue on to here';
});

app.listen(3000);
```

# License

MIT

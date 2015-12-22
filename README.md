# koa-connect

Use [Connect](https://github.com/senchalabs/connect)/[Express](https://github.com/strongloop/express) middleware with Koa

# Installation

```sh
npm install koa-connect
```

# Usage

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
See `tests.js` for additional examples

# License

MIT

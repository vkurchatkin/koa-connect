const PassThrough = require('stream').PassThrough;
/**
 * Inject raw response, so we can know if middleware has responsed.
 */
function makeInjectedResponse(koaCtx, markHandled, whenEnded) {
  let res = koaCtx.res;

  res.on('close', whenEnded).on('finish', whenEnded);

  let dummyRes = Object.create(res);
  [
    'setHeader',
    'writeHead',
    'write',
    'end'
  ].forEach(name => {
    dummyRes[name] = function (...args) {
      res[name](...args);
      // koa2.0 initial assign statusCode to 404, reset to 200
      if (res.statusCode === 404) {
        res.statusCode = 200;
      }
      markHandled();
    }
  });
  [
    'statusCode',
    'statusMessage'
  ].forEach(name => {
    dummyRes.__defineSetter__(name, function (value) {
      res[name] = value;
      markHandled();
    })
  })

  return dummyRes;
}

/**
 * The middleware function does include the `next` callback so only resolve
 * the Promise when it's called. If it's never called, the middleware stack
 * completion will stall
 */
function handler(ctx, connectMiddleware) {
  return new Promise((resolve, reject) => {
    let hasHandled = false;
    // (req, res)
    let args = [
      ctx.req,
      makeInjectedResponse(ctx, () => {
        hasHandled = true;
      }, () => {
        resolve(false);
      })
    ];
    let assumeSync = true
    // (req, res, next) or (err, req, res, next)
    if (connectMiddleware.length >= 3) {
      args.push(err => {
        if (err) reject(err)
        else resolve(true)
      })
      assumeSync = false
    }
    // (err, req, res, next)
    if (connectMiddleware.length >= 4) {
      args.unshift(null);
    }
    connectMiddleware(...args)
    /**
     * If the middleware function does not declare receiving the `next` callback
     * assume that it's synchronous.
     */
    if (assumeSync && !hasHandled) {
      resolve(true)
    }
  })
}

/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
function koaConnect(connectMiddleware) {
  return function koaConnect(ctx, next) {
    ctx.respond = false;
    return handler(ctx, connectMiddleware).then(goNext => {
      /** If has responded, assume job is done and skip next. */
      if(goNext){
        ctx.respond = true;
        return next();
      }
    }, err => {
      ctx.respond = true;
      throw err;
    });
  }
}

module.exports = koaConnect

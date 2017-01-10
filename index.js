const PassThrough = require('stream').PassThrough;
/**
 * Inject raw response, so we can know if middleware has responsed.
 */
function makeInjectedResponse(koaCtx, markResponded) {
  let res = koaCtx.res;
  let dummyRes = Object.create(res);
  [
    'setHeader',
    'writeHeader',
    'write',
    'end'
  ].forEach(name => {
    dummyRes[name] = function (...args) {
      res[name](...args);
      // koa2.0 initial assign statusCode to 404, reset to 200
      if (res.statusCode === 404) {
        res.statusCode = 200;
      }
      markResponded(name === 'end');
    }
  });
  [
    'statusCode',
    'statusMessage'
  ].forEach(name => {
    dummyRes.__defineSetter__(name, function (value) {
      res[name] = value;
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
      makeInjectedResponse(ctx, async (ended) => {
        hasHandled = true;
        if(ended){
          resolve(true)
        }
      })
    ];
    let assumeSync = true
    // (req, res, next) or (err, req, res, next)
    if (connectMiddleware.length >= 3) {
      args.push(err => {
        if (err) reject(err)
        else resolve()
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
      resolve()
    }
  })
}

/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
function koaConnect(connectMiddleware) {
  return async function koaConnect(ctx, next) {
    ctx.respond = false;
    let responded = await handler(ctx, connectMiddleware)
    /** If has responded, assume job is done and skip next. */
    if (!responded) {
      ctx.respond = true;
      return next();
    }
  }
}

module.exports = koaConnect

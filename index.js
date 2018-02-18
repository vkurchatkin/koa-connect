/**
 * Add alias for adapting the difference between express and koa
 */
function adaptResponseProperties(req, res) {
  Object.defineProperty(res, 'statusCode', { get: function() { return this.status; } });
  Object.defineProperty(res, 'statusCode', { set: function(code) { this.status = code; } });
}

/**
 * If the middleware function does declare receiving the `next` callback
 * assume that it's synchronous and invoke `next` ourselves
 */
function noCallbackHandler(ctx, connectMiddleware, next) {  
  connectMiddleware(ctx.req, ctx.res)
  return next()
}

/**
 * The middleware function does include the `next` callback so only resolve
 * the Promise when it's called. If it's never called, the middleware stack
 * completion will stall
 */
function withCallbackHandler(ctx, connectMiddleware, next) {
  return new Promise((resolve, reject) => {
    connectMiddleware(ctx.req, ctx.res, err => {
      if (err) reject(err)
      else resolve(next())
    })
  })
}

/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
function koaConnect(connectMiddleware) {
  const handler = connectMiddleware.length < 3
    ? noCallbackHandler
    : withCallbackHandler
  return function koaConnect(ctx, next) {
    adaptResponseProperties(ctx.req, ctx.res);
    return handler(ctx, connectMiddleware, next)
  }
}

module.exports = koaConnect

// If the middleware function does declare receiving the `next` callback
// assume that it's synchronous and invoke `next` ourselves
function noCallbackHandler(ctx, connectMiddleware, next) {
  connectMiddleware(ctx.req, ctx.res)
  return next()
}

// The middleware function does include the `next` callback so only resolve
// the Promise when it's called. If it's never called, the middleware stack
// completion will stall
function withCallbackHandler(ctx, connectMiddleware, next) {
  return new Promise((resolve, reject) => {
    connectMiddleware(ctx.req, ctx.res, err => {
      if (err) reject(err)
      else resolve(next())
    })
  })
}

module.exports = function koaConnect(connectMiddleware) {
  // Varying logic based on if the middleware function declaration includes
  // the `next` callback function
  const handler = connectMiddleware.length === 2
    ? noCallbackHandler
    : withCallbackHandler
  return function koaConnect(ctx, next) {
    return handler(ctx, connectMiddleware, next)
  }
}

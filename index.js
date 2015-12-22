module.exports = function koaConnect(connectMiddleware) {

  return function koaConnect(ctx, next) {
    connectMiddleware(ctx.req, ctx.res, (err) => {
      if (err) throw err;
      next();
    });
  };

};

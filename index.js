function c2k (middleware) {
  return function * c2k (next) {
    // It only takes `req` and `res`, no `next`
    if (middleware.length === 2) {
      middleware(this.req, this.res);
      return;
    }

    // Connect middleware takes `req`, `res`, and `next`
    yield new Promise((resolve, reject) => {
      middleware(this.req, this.res, function (err) {
        if (err) reject(err);
        else resolve();
      });
    })
    yield next;
  }
};

module.exports = c2k;

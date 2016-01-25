var connect = require('connect');

function c2k (middleware) {
  middleware = connect().use(middleware);

  return function * (next) {
    yield middleware.bind(null, this.req, this.response);
    yield next;
  }

}

module.exports = c2k;

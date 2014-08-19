var connect = require('connect')

function c2k (middleware) {
  middleware = connect(middleware)
  return function (next) {
    return function * () {
      yield middleware.bind(null, this.req, this.res)
      yield next
    }
  }
}

module.exports = c2k
const apiRouter = require('./api.router')
const productsRouter = require('./products.router')
const categoriesRouter = require('./categories.router')
const usersRouter = require('./users.router')
const authRouter = require('./auth.router')
const orderRouter = require('./orders.router')

module.exports = [
  {
    uri: '/api',
    router: apiRouter
  },
  {
    uri: '/products',
    router: productsRouter
  },
  {
    uri: '/categories',
    router: categoriesRouter
  },
  {
    uri: '/users',
    router: usersRouter
  },
  {
    uri: '/auth',
    router: authRouter
  },
  {
    uri: '/orders',
    router: orderRouter
  }
]

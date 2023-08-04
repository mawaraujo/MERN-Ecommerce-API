import apiRouter from './api.router.mjs'
import productsRouter from './products.router.mjs'
import categoriesRouter from './categories.router.mjs'
import usersRouter from './users.router.mjs'
import authRouter from './auth.mjs'

export default [
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
  }
]

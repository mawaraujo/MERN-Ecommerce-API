import apiRouter from './api.router.mjs'
import productsRouter from './products.router.mjs'
import categoriesRoutesr from './categories.router.mjs'

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
    router: categoriesRoutesr
  }
]

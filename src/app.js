const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const { Database } = require('./utils/database.js')
const routes = require('./router/index.js')
const { authenticate, authenticationHandler } = require('./middlewares/auth.middleware.js')
const path = require('node:path')

dotenv.config()
const app = express()
const port = (process.env.PORT || 3000)

app.use(cors())
app.options('*', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(authenticate())
app.use(authenticationHandler)
app.use('/public/upload/products', express.static(path.resolve(__dirname, '../public/upload/products')))

Database.connect()

routes.forEach(({ uri, router }) => {
  app.use(uri, router)
})

app.listen(port, () => {
  console.log('Server is running on http://localhost:3000')
})

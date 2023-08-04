import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { Database } from './utils/database.mjs'
import routes from './router/index.mjs'

dotenv.config()
const app = express()
const port = (process.env.PORT || 3000)

app.use(cors())
app.options('*', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

Database.connect()

routes.forEach(({ uri, router }) => {
  app.use(uri, router)
})

app.listen(port, () => {
  console.log('Server is running on http://localhost:3000')
})

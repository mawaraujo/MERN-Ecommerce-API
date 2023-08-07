const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const APP_JWT_SECRET = (process.env.APP_JWT_SECRET)

exports.authenticate = (payload) => {
  const token = jwt.sign(payload, APP_JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1d'
  })

  return token
}

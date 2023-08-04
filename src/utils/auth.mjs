import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const APP_JWT_SECRET = (process.env.APP_JWT_SECRET)

export function authenticate (payload) {
  const token = jwt.sign(payload, APP_JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1d'
  })

  return token
}

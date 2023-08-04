import bcrypt from 'bcryptjs'

const APP_PASSWORD_ENCRYPT_SECRET = (process.env.APP_PASSWORD_ENCRYPT_SECRET)

export function encryptPassword (password) {
  return bcrypt.hashSync(
    password,
    APP_PASSWORD_ENCRYPT_SECRET
  )
}

export function comparePassword (reqPassword, passwordHash) {
  return bcrypt.compareSync(
    reqPassword,
    passwordHash
  )
}

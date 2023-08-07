const bcrypt = require('bcryptjs')

const APP_PASSWORD_ENCRYPT_SECRET = (process.env.APP_PASSWORD_ENCRYPT_SECRET)

exports.encryptPassword = (password) => {
  return bcrypt.hashSync(
    password,
    APP_PASSWORD_ENCRYPT_SECRET
  )
}

exports.comparePassword = (reqPassword, passwordHash) => {
  return bcrypt.compareSync(
    reqPassword,
    passwordHash
  )
}

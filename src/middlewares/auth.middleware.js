const { expressjwt } = require('express-jwt')

const APP_JWT_SECRET = (process.env.APP_JWT_SECRET)

// Check if is not a admin
async function isRevoked (_req, { payload }) {
  return (
    !payload.isAdmin
  )
}

exports.authenticate = () => {
  return expressjwt({
    secret: APP_JWT_SECRET,
    algorithms: [
      'HS256'
    ],
    isRevoked
  }).unless({
    path: [
      {
        url: /\/public\/upload(.*)/,
        methods: [
          'GET',
          'OPTIONS'
        ]
      },
      {
        url: /\/products(.*)/,
        methods: [
          'GET',
          'OPTIONS'
        ]
      },
      {
        url: /\/categories(.*)/,
        methods: [
          'GET',
          'OPTIONS'
        ]
      },
      '/auth/login',
      '/auth/register'
    ]
  })
}

exports.authenticationHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      message: 'The user is not authorized'
    })
    return
  }

  if (err.name === 'ValidationError') {
    res.status(401).json({
      err
    })
    return
  }

  res.status(500).json({
    err
  })
}

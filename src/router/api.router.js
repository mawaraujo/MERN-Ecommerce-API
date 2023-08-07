const { Router } = require('express')

const router = Router()

router.get('/', (_request, response) => {
  response.json({
    message: 'Server working'
  })
})

module.exports = router

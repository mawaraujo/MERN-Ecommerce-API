import { Router } from 'express'

const router = Router()

router.get('/', (_request, response) => {
  response.json({
    message: 'Server working'
  })
})

export default router

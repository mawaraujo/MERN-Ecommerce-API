const { Router } = require('express')
const { User } = require('../models')
const { encryptPassword } = require('../utils/encrypt.js')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const users = await User.paginate({}, {
      page,
      limit,
      select: ['-password']
    })

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      res.status(404).json({
        message: 'User not found'
      })
    }

    res.json(user)
  } catch (error) {
    console.log(error)

    res
      .status(400)
      .json({
        message: 'Error ocurred'
      })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      street,
      apartment,
      city,
      zip,
      country
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password: encryptPassword(password),
        phone,
        street,
        apartment,
        city,
        zip,
        country
      },
      {
        new: true
      }
    )

    if (!user) {
      res.status(404).json({
        message: 'User not found'
      })
      return
    }

    res.json({
      message: 'User updated',
      user
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)

    if (user) {
      res.json({
        message: 'User deleted'
      })

      return
    }

    res.status(404).json({
      message: `User with id ${req.params.id} not found`
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/get/count', async (req, res) => {
  try {
    const totalUsers = await User.count({})

    if (!totalUsers) {
      res.status(400).json({
        message: 'Error ocurred'
      })
      return
    }

    res.json({
      totalUsers
    })
  } catch (error) {
    console.log(error)

    res
      .status(400)
      .json({
        message: 'Error ocurred'
      })
  }
})

module.exports = router

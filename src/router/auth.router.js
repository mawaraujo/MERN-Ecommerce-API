const { Router } = require('express')
const { User } = require('../models')
const { comparePassword, encryptPassword } = require('../utils/encrypt.js')
const { authenticate } = require('../utils/auth.js')

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(401).json({
        message: 'email and password field are required'
      })
      return
    }

    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      res.status(401).json({
        message: 'User not found'
      })
      return
    }

    // Check if password is correct
    if (!password || !comparePassword(password, user.password)) {
      res.status(401).json({
        message: 'Password or email invalid'
      })
      return
    }

    const token = authenticate({
      userId: user.id,
      isAdmin: user.isAdmin
    })

    res.json({
      message: 'Login success',
      token
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      message: 'Login failure'
    })
  }
})

router.post('/register', async (req, res) => {
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

    const user = new User({
      name,
      email,
      password: encryptPassword(password),
      phone,
      street,
      apartment,
      city,
      zip,
      country
    })

    await user.save()

    res
      .status(200)
      .json({
        message: 'User registered successfully',
        user
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

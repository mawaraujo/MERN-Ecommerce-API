const { Router } = require('express')
const { Category } = require('../models')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      res.status(404).json({
        message: 'Category not found'
      })
      return
    }

    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, icon, color } = req.body

    const category = new Category({ name, icon, color })
    await category.save()

    res.json({
      message: 'Category created',
      category
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    )

    if (!category) {
      res.status(404).json({
        message: 'Category not found'
      })
      return
    }

    res.json({
      message: 'Category updated',
      category
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
    const categories = await Category.findByIdAndRemove(req.params.id)

    if (categories) {
      res.json({
        message: 'Category deleted'
      })

      return
    }

    res.status(404).json({
      message: `Category with id ${req.params.id} not found`
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

module.exports = router

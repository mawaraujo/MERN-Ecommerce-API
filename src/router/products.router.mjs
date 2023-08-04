import { Router } from 'express'
import { Category, Product } from '../models/index.mjs'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isFeatured } = req.query
    const query = {}

    if (category) {
      query.category = category
    }

    if (isFeatured) {
      query.isFeatured = isFeatured
    }

    const products = await Product.paginate(
      query,
      {
        page,
        limit,
        populate: 'category'
      }
    )

    res.status(200).json(products)
  } catch (error) {
    console.log(error)

    res
      .status(400)
      .json({
        message: 'Error ocurred'
      })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')

    if (!product) {
      res.status(404).json({
        message: 'Product not found'
      })
    }

    res.json(product)
  } catch (error) {
    console.log(error)

    res
      .status(400)
      .json({
        message: 'Error ocurred'
      })
  }
})

router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      display
    } = req.body

    const categoryFind = await Category.findById(category)

    if (!categoryFind) {
      res.status(400).json({
        message: 'Invalid Category Id'
      })
      return
    }

    const product = new Product({
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      display
    })

    await product.save()

    res
      .status(200)
      .json({
        message: 'Product created',
        product
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

router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      display
    } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        richDescription,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
        display
      },
      {
        new: true
      }
    )

    if (!product) {
      res.status(404).json({
        message: 'Product not found'
      })
      return
    }

    res.json({
      message: 'Product updated',
      product
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
    const categories = await Product.findByIdAndRemove(req.params.id)

    if (categories) {
      res.json({
        message: 'Product deleted'
      })

      return
    }

    res.status(404).json({
      message: `Product with id ${req.params.id} not found`
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
    const totalProducts = await Product.count({})

    if (!totalProducts) {
      res.status(400).json({
        message: 'Error ocurred'
      })
      return
    }

    res.json({
      totalProducts
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

export default router

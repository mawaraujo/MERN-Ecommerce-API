const { Router } = require('express')
const { Category, Product } = require('../models')
const { createStorage } = require('../middlewares/storage.middleware.js')

const router = Router()
const storage = createStorage('/upload/products')

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
      return
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

router.post('/', storage.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      display
    } = req.body

    if (!req.file) {
      res.status(400).json({
        message: 'Image field is required'
      })
      return
    }

    const filename = req.file.filename
    const fileBasePath = `${req.protocol}://${req.get('host')}/public/upload/products`
    const path = `${fileBasePath}/${filename}`

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
      image: path,
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

router.put('/:id', storage.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      display
    } = req.body

    const product = Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({
        message: 'Product not found'
      })
      return
    }

    const file = req.file
    let imagePath

    if (file) {
      const filename = req.file.filename
      const fileBasePath = `${req.protocol}://${req.get('host')}/public/upload/products`
      imagePath = `${fileBasePath}/${filename}`
    } else {
      imagePath = product.image
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        richDescription,
        image: imagePath,
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

    res.json({
      message: 'Product updated',
      updatedProduct
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.put('/image-gallery/:id', storage.array('images', 10), async (req, res) => {
  try {
    const files = req.files
    const imagesPaths = []
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/products`

    if (files) {
      files.forEach((file) => {
        imagesPaths.push(`${basePath}/${file.filename}`)
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths
      },
      { new: true }
    )

    if (!product) {
      res.status(404).json({
        message: 'The gallery cannot be updated'
      })
      return
    }

    res.send(product)
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

module.exports = router

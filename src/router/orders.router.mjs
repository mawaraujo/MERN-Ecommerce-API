import { Router } from 'express'
import { Order, OrderItem } from '../models/index.mjs'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const orders = await Order.paginate({}, {
      page,
      limit,
      populate: [
        {
          path: 'user',
          select: ['name', 'email', 'phone']
        }
      ],
      sort: {
        createdAt: '-1'
      }
    })

    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', ['name', 'email', 'phone'])
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select: ['name', 'price'],
          populate: {
            path: 'category',
            select: ['name']
          }
        }
      })

    if (!order) {
      res.status(404).json({
        message: 'Order not found'
      })
      return
    }

    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

async function createOrderItems (orderItems) {
  const items = await Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
      })

      newOrderItem = await newOrderItem.save()
      return newOrderItem._id
    })
  )

  return items
}

async function getTotalPrice (orderItemsId) {
  const totalPrices = await Promise.all(
    orderItemsId.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
      const totalPirce = orderItem.product.price * orderItem.quantity
      return totalPirce
    })
  )

  return totalPrices
    .reduce((a, b) => a + b, 0)
}

router.post('/', async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user
    } = req.body

    const orderItemsId = await createOrderItems(orderItems)
    const totalPrice = await getTotalPrice(orderItemsId)

    const order = new Order({
      orderItems: orderItemsId,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user
    })

    await order.save()

    res.json({
      message: 'Order created',
      order
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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        updatedAt: Date.now()
      },
      {
        new: true
      }
    )

    if (!order) {
      res.status(404).json({
        message: 'Order not found'
      })
      return
    }

    res.json({
      message: 'Order updated',
      order
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
    const order = await Order.findByIdAndRemove(req.params.id)

    if (!order) {
      res.status(404).json({
        message: `Order with id ${req.params.id} not found`
      })

      return
    }

    await order.orderItems.map(async orderItem => {
      await OrderItem
        .findByIdAndRemove(orderItem)
    })

    res.json({
      message: `Order with id ${req.params.id} deleted`
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/get/totalSales', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: '$totalPrice'
          }
        }
      }
    ])

    res.json({
      totalSales: totalSales.pop().totalSales
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
    const orderCount = await Order.count({})

    res.json({
      orderCount
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

router.get('/get/users/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const userOrderList = await Order.paginate(
      {
        user: req.params.userId
      },
      {
        page,
        limit,
        populate: [
          {
            path: 'orderItems',
            populate: {
              path: 'product',
              select: ['name', 'price'],
              populate: {
                path: 'category',
                select: ['name']
              }
            }
          }
        ],
        sort: {
          createdAt: '-1'
        }
      }
    )

    res.json(userOrderList)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error ocurred'
    })
  }
})

export default router

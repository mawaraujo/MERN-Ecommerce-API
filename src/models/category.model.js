const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
})

exports.Category = mongoose.model(
  'Category',
  categorySchema
)

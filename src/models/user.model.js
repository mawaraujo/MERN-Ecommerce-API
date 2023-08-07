const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.plugin(mongoosePaginate)

// userSchema.virtual('id').get(function () {
//   return this._id.toHexString()
// })

// userSchema.set('toJSON', {
//   virtuals: true
// })

exports.User = mongoose.model(
  'User',
  userSchema
)

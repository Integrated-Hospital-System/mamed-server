const { Schema, model } = require('mongoose')

const options = {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  },
}

const medicineSchema = new Schema(
  {
    name: { type: String, required: [true, 'Medicine name is required'] },
    description: String,
    stock: Number,
  },
  options
)

const Medicine = new model('Medicine', medicineSchema)

module.exports = { Medicine }

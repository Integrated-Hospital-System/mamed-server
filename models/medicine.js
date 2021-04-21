const { Schema, model } = require('mongoose')

const options = {
  virtuals: true,
  versionKey: false,
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

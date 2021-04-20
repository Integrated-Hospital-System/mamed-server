const { Schema, model } = require('mongoose')

const options = {
  virtuals: true,
  versionKey: false,
}

const medicineSchema = new Schema({
  medicine: { type: Schema.Types.ObjectId, ref: 'Medicine' },
  timesPerDay: Number,
  doses: Number,
  totalMedicine: Number,
})

const orderSchema = new Schema(
  {
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    medicines: [medicineSchema],
    diseases: [String],
  },
  options
)

const Order = new model('Order', orderSchema)

module.exports = { Order }

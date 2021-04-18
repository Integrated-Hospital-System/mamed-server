const { Schema, model } = require('mongoose')

const options = {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  },
}

const appointmentSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Account' },
    patient: { type: Schema.Types.ObjectId, ref: 'Account' },
    appointmentDate: {
      type: Date,
      required: [true, 'appointmentDate cannot be empty'],
    },
    isCompleted: { type: Boolean, default: false },
  },
  options
)

appointmentSchema.pre('save', function () {
  this.appointmentDate = new Date(this.appointmentDate)
})

const Appointment = new model('Appointment', appointmentSchema)

module.exports = { Appointment }

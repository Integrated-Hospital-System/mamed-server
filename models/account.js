const { Schema, model } = require('mongoose')
const { encrypt } = require('../helpers/bcrypt')

const options = {
  discriminatorKey: 'role',
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  },
}

const validateEmail = {
  validator: async function (email) {
    const account = await this.constructor.findOne({ email })
    if (!account) return true
    return this.id === account.id
  },
  message: (props) => 'Email already have been used',
}

const accountSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name cannot be empty'] },
    password: { type: String, required: [true, 'Password cannot be empty'] },
    email: {
      type: String,
      validate: [validateEmail],
      required: [true, 'Email cannot be empty'],
    },
  },
  options
)

accountSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  this.password = encrypt(this.password)
  next()
})

const adminSchema = new Schema({}, options)

const practiceSchema = new Schema({
  day: { type: String, required: [true, 'Day cannot be empty'] },
  start: { type: String, required: [true, 'Start time cannot be empty'] },
  end: { type: String, required: [true, 'End time cannot be empty'] },
})

const doctorSchema = new Schema(
  {
    speciality: [String],
    practice: [practiceSchema],
    image_url: String,
  },
  options
)

const patientSchema = new Schema(
  {
    age: { type: Number, required: [true, 'Age cannot be empty'] },
    gender: String,
    comorbid: [String],
  },
  options
)

const Account = new model('Account', accountSchema)
const Admin = Account.discriminator('Admin', adminSchema)
const Doctor = Account.discriminator('Doctor', doctorSchema)
const Patient = Account.discriminator('Patient', patientSchema)

module.exports = {
  Account,
  Admin,
  Doctor,
  Patient,
}

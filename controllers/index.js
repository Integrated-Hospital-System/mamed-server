const { AccountController } = require('./account-controller')
const { AppointmentController } = require('./appointment-controller')
const { AuthController } = require('./auth-controller')
const { MedicineController } = require('./medicine-controller')
const { OrderController } = require('./order-controller')

module.exports = {
  AccountController,
  AuthController,
  MedicineController,
  AppointmentController,
  OrderController,
}

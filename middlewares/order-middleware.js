const { Order } = require('../models/order')
const { Appointment } = require('../models/appointment')

const { NamedError } = require('../helpers/error-formatter')

class OrderMiddleware {
  static authorize = async (req, res, next) => {
    try {
      if (req.account.role === 'Admin') return next()
      const { appointmentId } = req.params
      const appointment = await Appointment.findById(appointmentId)
      console.log(JSON.stringify(appointment, null, 2))
      const order = await Order.findOne({ appointment: appointmentId })
      if (!order) throw NamedError.NOT_FOUND
      switch (req.account._id.toString()) {
        case appointment.doctor.toString():
        case appointment.patient.toString():
          return next()
      }
      throw NamedError.AUTHORIZATION
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { OrderMiddleware }

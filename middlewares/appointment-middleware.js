const { NamedError } = require('../helpers/error-formatter')
const { Appointment } = require('../models/appointment')

class AppointmentMiddleware {
  static authorize = async (req, res, next) => {
    try {
      if (req.account.role === 'Admin') return next()
      const { id } = req.params
      const appointment = await Appointment.findById(id).lean()
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

module.exports = { AppointmentMiddleware }

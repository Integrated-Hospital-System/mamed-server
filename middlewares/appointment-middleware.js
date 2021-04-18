class AppointmentMiddleware {
  static authorize = async (req, res, next) => {
    try {
      if (req.account.role === 'Admin') return next()
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AppointmentMiddleware }

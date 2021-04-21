const { NamedError } = require('../helpers/error-formatter')

class AccountMiddleware {
  static assignRole = (req, res, next) => {
    if (!req?.body?.role) req.body.role = ''
    switch (req.body.role) {
      case 'Patient':
      case 'Doctor':
        return next()
      case '':
        req.body.role = 'Patient'
        return next()
      default:
        return next(NamedError.INVALID_ROLE)
    }
  }

  static excludePatientRole = (req, res, next) => {
    if (req.body.role !== 'Patient') return next()
    next(NamedError.USE_REGISTER)
  }
}

module.exports = { AccountMiddleware }

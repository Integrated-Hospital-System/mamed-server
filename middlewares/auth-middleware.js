const { NamedError } = require('../helpers/error-formatter')
const { verify } = require('../helpers/jwt')
const { Account } = require('../models/account')

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const { access_token } = req.headers
      if (!access_token) throw NamedError.AUTHENTICATION
      const { _id, email } = verify(access_token)
      if (!email || !_id) throw NamedError.AUTHENTICATION
      const account = await Account.findOne({ email, _id })
      if (!account) throw NamedError.AUTHENTICATION
      req.account = account.toObject()
      next()
    } catch (error) {
      next(error)
    }
  },
  authorizePatient: async (req, res, next) => {
    try {
      if (req.account.role.toString() === 'Patient') return next()
      if (req.account.role.toString() === 'Admin') return next()
      throw NamedError.AUTHORIZATION
    } catch (error) {
      next(error)
    }
  },
  authorizeDoctor: async (req, res, next) => {
    try {
      if (req.account.role.toString() === 'Doctor') return next()
      if (req.account.role.toString() === 'Admin') return next()
      throw NamedError.AUTHORIZATION
    } catch (error) {
      next(error)
    }
  },
}

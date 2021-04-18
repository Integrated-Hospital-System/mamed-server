const { Patient, Account } = require('../models/account')
const _ = require('lodash')
const { NamedError } = require('../helpers/error-formatter')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
class AuthController {
  static register = async (req, res, next) => {
    try {
      const { _id } = await new Patient(req.body).save()
      const patient = await Account.findById(_id).lean()
      res.status(201).json(patient)
    } catch (error) {
      next(error)
    }
  }
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) throw NamedError.BAD_LOGIN
      const account = await Account.findOne({ email })
      if (!email) throw NamedError.LOGIN
      if (!compare(password, account.password)) throw NamedError.LOGIN
      res.status(200).json({ account, access_token: sign(account.toObject()) })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AuthController }

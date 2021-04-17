const { Patient, Account } = require('../models/account')
const _ = require('lodash')
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
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AuthController }

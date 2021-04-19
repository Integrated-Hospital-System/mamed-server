const { Account } = require('../models/account')

class AccountController {
  static index = async (req, res, next) => {
    try {
      const account = await Account.findById(req.account._id)
      res.status(200).json(account)
    } catch (error) {
      next(error)
    }
  }
  static create = async (req, res, next) => {
    try {
      const { _id } = await new Account(req.body).save()
      const account = await Account.findById(_id).lean()
      res.status(201).json(account)
    } catch (error) {
      next(error)
    }
  }
  static readAll = async (req, res, next) => {
    try {
      const accounts = await Account.find(req.query).lean()
      res.status(200).json(accounts)
    } catch (error) {
      next(error)
    }
  }
  static readOne = async (req, res, next) => {
    try {
      const account = await Account.findById(req.params.id)
      res.status(200).json(account)
    } catch (error) {
      next(error)
    }
  }
  static update = async (req, res, next) => {
    try {
      const acc = await Account.findByIdAndUpdate(req.params.id)
      if (acc.role === 'Doctor') acc.practice = req.body.practice
      if (acc.role === 'Patient') acc.comorbid = req.body.comorbid
      await acc.save()
      const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      res.status(200).json(account)
    } catch (error) {
      next(error)
    }
  }
  static delete = async (req, res, next) => {
    try {
      await Account.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: 'Account successfully deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AccountController }

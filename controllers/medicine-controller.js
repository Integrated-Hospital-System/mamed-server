const { Medicine } = require('../models/medicine')

class MedicineController {
  static create = async (req, res, next) => {
    try {
      const { _id } = await new Medicine(req.body).save()
      const medicine = await Medicine.findById(_id).lean()
      res.status(201).json(medicine)
    } catch (error) {
      next(error)
    }
  }
  static readAll = async (req, res, next) => {
    try {
      const medicines = await Medicine.find(req.query).lean()
      res.status(200).json(medicines)
    } catch (error) {
      next(error)
    }
  }
  static readOne = async (req, res, next) => {
    try {
      const medicine = await Medicine.findById(req.params.id)
      res.status(200).json(medicine)
    } catch (error) {
      next(error)
    }
  }
  static update = async (req, res, next) => {
    try {
      const medicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      res.status(200).json(medicine)
    } catch (error) {
      next(error)
    }
  }
  static delete = async (req, res, next) => {
    try {
      await Medicine.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: 'Medicine successfully deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { MedicineController }

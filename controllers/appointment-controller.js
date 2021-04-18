const { NamedError } = require('../helpers/error-formatter')
const { Account } = require('../models/account')
const { Appointment } = require('../models/appointment')

class AppointmentController {
  static create = async (req, res, next) => {
    try {
      const patient = await Account.findById(req.account._id)
      const doctor = await Account.findById(req.body.doctorId)
      if (!patient || !doctor) throw NamedError.NOT_FOUND
      const { _id } = await new Appointment({
        ...req.body,
        doctor: doctor._id,
        patient: patient._id,
      }).save()

      const appointment = await Appointment.findById(_id)
        .populate('doctor')
        .populate('patient')

      res.status(200).json(appointment)
    } catch (error) {
      next(error)
    }
  }
  static readAll = async (req, res, next) => {
    try {
      const query = {}
      switch (req.account.role) {
        case 'Patient':
          query.patient = req.account._id
          break
        case 'Doctor':
          query.doctor = req.account._id
          break
      }
      const appointments = await Appointment.find(query)
        .populate('doctor')
        .populate('patient')
      res.status(200).json(appointments)
    } catch (error) {
      next(error)
    }
  }
  static readOne = async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id).lean()
      res.status(200).json(appointment)
    } catch (error) {
      next(error)
    }
  }
  static update = async (req, res, next) => {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
      res.status(200).json(appointment)
    } catch (error) {
      next(error)
    }
  }
  static updateCompletion = async (req, res, next) => {
    try {
      const { isCompleted } = req.body
      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { isCompleted },
        {
          new: true,
        }
      )
      res.status(200).json(appointment)
    } catch (error) {
      next(error)
    }
  }
  static delete = async (req, res, next) => {
    try {
      await Appointment.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: 'Appointment successfully deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AppointmentController }

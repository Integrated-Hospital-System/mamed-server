const { Types } = require('mongoose')
const { NamedError } = require('../helpers/error-formatter')
const { Appointment } = require('../models/appointment')
const { Medicine } = require('../models/medicine')
const { Order } = require('../models/order')

class OrderController {
  static _formatOrder = (appointment) => ({
    ...appointment.toObject().order,
  })

  static create = async (req, res, next) => {
    try {
      const { appointmentId } = req.params
      const { isCompleted } = await Appointment.findById(
        appointmentId,
        'isCompleted'
      )
      if (isCompleted) throw NamedError.RECREATE_ORDER
      const updateStock = await req.body?.medicines?.map(
        async ({ medicineId, totalMedicine }) => {
          const { stock } = await Medicine.findById(medicineId, 'stock')
          const body = { stock: +stock - +totalMedicine }
          return Medicine.findByIdAndUpdate(medicineId, body)
        }
      )
      await Promise.all(updateStock)
      const order = await new Order({
        ...req.body,
        appointment: Types.ObjectId(appointmentId),
        medicines: req.body?.medicines?.map((e) => ({
          ...e,
          medicine: e.medicineId,
        })),
      }).save()

      await Appointment.findByIdAndUpdate(appointmentId, {
        order: order._id,
        isCompleted: true,
      })
      res.status(201).json(order)
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
      const orders = await Appointment.find(query, 'order').populate({
        path: 'order',
        populate: {
          path: 'appointment',
          select: { order: 0 },
          populate: ['patient', 'doctor'],
        },
      })
      const formatted = orders.map(this._formatOrder)
      res.status(200).json(formatted)
    } catch (error) {
      next(error)
    }
  }
  static readOne = async (req, res, next) => {
    const { appointmentId } = req.params
    try {
      const order = await Order.findOne({
        appointment: appointmentId,
      }).populate([
        {
          path: 'appointment',
          select: { order: 0 },
          populate: ['patient', 'doctor'],
        },
        { path: 'medicines', populate: 'medicine' },
      ])
      res.status(200).json(order)
    } catch (error) {
      next(error)
    }
  }
  static update = async (req, res, next) => {
    try {
      const { appointmentId } = req.params
      const order = await Order.findOne({ appointment: appointmentId })
      order.medicines = req.body.medicines
      order.diseases = req.body.diseases
      await order.save()
      res.status(200).json(order)
    } catch (error) {
      next(error)
    }
  }
  static delete = async (req, res, next) => {
    try {
      const { appointmentId } = req.params
      await Order.findOneAndDelete({ appointment: appointmentId })
      res.status(200).json({ message: 'Order successfully deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { OrderController }

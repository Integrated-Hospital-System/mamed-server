const { AppointmentController } = require('../controllers')
const {
  authorizePatient,
  authorizeDoctor,
} = require('../middlewares/auth-middleware')

const router = require('express').Router()

router
  .route('/')
  .post(authorizePatient, AppointmentController.create)
  .get(AppointmentController.readAll)

router
  .route('/id')
  .get(AppointmentController.readOne)
  .put(AppointmentController.update)
  .patch(authorizeDoctor, AppointmentController.updateCompletion)
  .delete(authorizeDoctor, AppointmentController.delete)

module.exports = router

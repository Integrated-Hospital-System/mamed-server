const { AppointmentController } = require('../controllers')
const {
  AppointmentMiddleware,
} = require('../middlewares/appointment-middleware')
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
  .route('/:id')
  .get(AppointmentMiddleware.authorize, AppointmentController.readOne)
  .put(AppointmentMiddleware.authorize, AppointmentController.update)
  .patch(
    authorizeDoctor,
    AppointmentMiddleware.authorize,
    AppointmentController.updateCompletion
  )
  .delete(
    authorizeDoctor,
    AppointmentMiddleware.authorize,
    AppointmentController.delete
  )

module.exports = router

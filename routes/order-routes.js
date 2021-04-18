const { OrderController } = require('../controllers')

const router = require('express').Router()

router.route('/').post(OrderController.create).get(OrderController.readAll)

router
  .route('/:appointmentId')
  .get(OrderController.readOne)
  .put(OrderController.update)
  .delete(OrderController.delete)

module.exports = router

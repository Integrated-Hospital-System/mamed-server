const { OrderController } = require('../controllers')
const { authorizeDoctor } = require('../middlewares/auth-middleware')
const { OrderMiddleware } = require('../middlewares/order-middleware')

const router = require('express').Router()

router.route('/').get(OrderController.readAll)

router
  .route('/:appointmentId')
  .post(authorizeDoctor, OrderController.create)
  .get(OrderMiddleware.authorize, OrderController.readOne)
  .put(authorizeDoctor, OrderMiddleware.authorize, OrderController.update)
  .delete(authorizeDoctor, OrderMiddleware.authorize, OrderController.delete)

module.exports = router

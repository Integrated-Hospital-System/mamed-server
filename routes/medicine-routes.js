const { MedicineController } = require('../controllers')
const { authorizeDoctor } = require('../middlewares/auth-middleware')

const router = require('express').Router()

router
  .route('/')
  .post(authorizeDoctor, MedicineController.create)
  .get(MedicineController.readAll)

router
  .route('/:id')
  .get(MedicineController.readOne)
  .put(authorizeDoctor, MedicineController.update)
  .delete(authorizeDoctor, MedicineController.delete)

module.exports = router

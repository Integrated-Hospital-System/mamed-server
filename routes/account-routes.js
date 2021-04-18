const { AccountController } = require('../controllers')
const { AccountMiddleware } = require('../middlewares')

const router = require('express').Router()

router
  .route('/')
  .get(AccountController.readAll)
  .post(
    AccountMiddleware.assignRole,
    AccountMiddleware.excludePatientRole,
    AccountController.create
  )

router.get('/index', AccountController.index)

router
  .route('/:id')
  .get(AccountController.readOne)
  .put(AccountController.update)
  .delete(AccountController.delete)

module.exports = router

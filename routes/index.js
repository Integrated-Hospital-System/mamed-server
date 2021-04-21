const router = require('express').Router()

const authRoutes = require('./auth-routes')
const accountRoutes = require('./account-routes')
const medicineRoutes = require('./medicine-routes')
const appointmentRoutes = require('./appointment-routes')
const orderRoutes = require('./order-routes')
const { authenticate } = require('../middlewares/auth-middleware')

router.use('/', authRoutes)
router.use(authenticate)
router.use('/accounts', accountRoutes)
router.use('/medicines', medicineRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/orders', orderRoutes)

module.exports = router

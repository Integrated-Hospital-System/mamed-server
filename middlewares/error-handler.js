const { NamedError } = require('../helpers/error-formatter')

module.exports = (err, req, res, next) => {
  console.log(err.name)
  let status, message

  switch (err.name) {
    case NamedError.INVALID_ROLE.name:
      status = 400
      message = [`Invalid role of ${req.body.role}`]
      break
    case NamedError.USE_REGISTER.name:
      status = 400
      message = ['use /register for creating patient']
      break
    case 'ValidationError':
      status = 400
      message = Object.entries(err.errors).map(([key, value]) => value.message)
      break
    default:
      console.error(JSON.stringify(err, null, 2), '<<><< error')
      console.error(err)
      status = 500
      message = ['internal server error']
      break
  }

  res.status(status).json({ message })
}

const { NamedError } = require('../helpers/error-formatter')

module.exports = (err, req, res, next) => {
  console.log(err.name)
  let status, message

  switch (err.name) {
    case NamedError.BAD_LOGIN.name:
      status = 400
      message = ['email or password cannot be empty']
      break
    case NamedError.LOGIN.name:
      status = 401
      message = ['invalid email or password']
      break
    case 'JsonWebTokenError':
    case NamedError.AUTHENTICATION.name:
      status = 401
      message = ['user not authenticated']
      break
    case NamedError.AUTHORIZATION.name:
      status = 401
      message = ['user not authorized']
      break
    case NamedError.NOT_FOUND.name:
      status = 404
      message = ['data not found']
      break
    case NamedError.INVALID_ROLE.name:
      status = 400
      message = [`Invalid role of ${req.body.role}`]
      break
    case NamedError.USE_REGISTER.name:
      status = 400
      message = ['use /register for creating patient']
      break
    case NamedError.RECREATE_ORDER.name:
      status = 400
      message = ['Cannot re-create order, use update instead!']
      break
    case 'ValidationError':
      status = 400
      message = Object.entries(err.errors).map(([key, value]) => value.message)
      break
    default:
      console.error(JSON.stringify(err, null, 2), '<< JSON Error')
      console.error(err, 'masuk sini')
      status = 500
      message = ['internal server error']
      break
  }

  res.status(status).json({ message })
}

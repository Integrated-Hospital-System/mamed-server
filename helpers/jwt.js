const secret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

const sign = (payload) => jwt.sign(payload, secret)
const verify = (token) => jwt.verify(token, secret)

module.exports = { sign, verify }

const env = process.env.NODE_ENV
if (env === 'development' || env === 'test') require('dotenv').config()
const mongoose = require('mongoose')
const connection = require('../helpers/db-connection')
const { Admin } = require('../models/account')

const data = {
  name: 'Admin',
  email: 'admin@email.com',
  password: 'test1234',
}

const seed = async () => {
  try {
    await mongoose.connect(connection.getDBName(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const admin = await new Admin(data).save()
    await mongoose.disconnect()
    console.log(admin, 'admin added')
  } catch (error) {
    console.error(error)
  }
}

seed()

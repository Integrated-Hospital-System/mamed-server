const env = process.env.NODE_ENV
if (env === 'development' || env === 'test') require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())

const connection = require('./helpers/db-connection')
const errorHandler = require('./middlewares/error-handler')
const router = require('./routes')

mongoose
  .connect(connection.getDBName(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to DB'))
  .catch((error) => console.error(error))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(router)

app.use(errorHandler)
module.exports = app

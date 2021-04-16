const env = process.env.NODE_ENV
if (env === 'development' || env === 'test') require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const connection = require('./helpers/db-connection')

mongoose
  .connect(connection.getDBName(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to DB'))
  .catch((error) => console.error(error))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

module.exports = app

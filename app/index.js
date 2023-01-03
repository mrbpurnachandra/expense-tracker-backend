const express = require('express')
const bodyParser = require('body-parser')
const db = require('../config/database')
const authRouter = require('../routes/auth')
const errorHandler = require('../middlewares/errorHandler')

const app = express()
db.connect((err) => {
    if (err) throw err
})

app.use(bodyParser.json())

app.use('/auth', authRouter)

app.use(errorHandler)

module.exports = app
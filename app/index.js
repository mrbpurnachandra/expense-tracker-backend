const express = require('express')
const bodyParser = require('body-parser')
const qs = require('qs')
const cors = require('cors')
const db = require('../config/database')
const authRouter = require('../routes/auth')
const expenseRouter = require('../routes/expense')
const errorHandler = require('../middlewares/errorHandler')

const app = express()
db.connect((err) => {
    if (err) throw err
})

app.set('query parser', str => qs.parse(str))
app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRouter)
app.use('/expense', expenseRouter)

app.use(errorHandler)

module.exports = app
const express = require('express')
const Expense = require('../models/expense')
const expenseSchema = require('../schemas/expense')
const auth = require('../middlewares/auth')
const asyncWrapper = require('../lib/asyncWrapper')

const router = express.Router()

router.use(auth) // All routes are protected and requires auth

router.get('/', asyncWrapper(async (req, res, next) => {
    const { startDate, endDate } = req.query
    const interval = {
        startDate: new Date(startDate || process.env.APP_START_DATE),
        endDate: new Date(endDate || Date.now())
    }

    const expenses = await Expense.findOnIntervalByUser(req.user.id, interval)

    res.json(expenses)
}))

router.post('/', asyncWrapper(async (req, res, next) => {
    const { error, value } = expenseSchema.validate(req.body)
    if (error) throw { message: error.message, status: 400 }

    const { topic, amount, urgencyId } = value
    const expense = await Expense.addOne(topic, amount, req.user.id, urgencyId)

    res.status(201)
    res.json(expense)
}))

router.get('/:id', asyncWrapper(async (req, res, next) => {
    const { id } = req.params

    const expense = await Expense.findOneByUser(id, req.user.id)
    if (!expense) throw { message: 'Not Found', status: 404 }

    res.json(expense)
}))

router.put('/:id', asyncWrapper(async (req, res, next) => {
    const { id } = req.params

    const expense = await Expense.findOneByUser(id, req.user.id)
    if (!expense) throw { message: 'Not Found', status: 404 }

    const { error, value } = expenseSchema.validate(req.body)
    if (error) throw { message: error.message, status: 400 }

    const { topic, amount, urgencyId } = value
    const isUpdated = await Expense.updateById(id, topic, amount, urgencyId)

    if (!isUpdated) throw { message: 'Server Error', status: 500 }
    const updatedExpense = await Expense.findOne(id)

    res.json(updatedExpense)
}))

router.delete('/:id', asyncWrapper(async (req, res, next) => {
    const { id } = req.params

    const expense = await Expense.findOneByUser(id, req.user.id)
    if(!expense) throw { message: 'Not Found', status: 404}

    const isDeleted = await Expense.deleteById(id)
    if(!isDeleted) throw { message: 'Server Error', status: 500}

    res.json(expense)
}))

module.exports = router
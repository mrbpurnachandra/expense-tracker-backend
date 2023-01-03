const express = require('express')
const auth = require('../middlewares/auth')
const userSchema = require('../schemas/user')
const asyncWrapper = require('../lib/asyncWrapper')
const User = require('../models/user')
const router = express.Router()

// TODO - Testing
router.get('/secure', auth, (req, res, next) => {
    res.send('Secure api')
})

router.post('/register', asyncWrapper(async (req, res, next) => {
    const { error, value, warning } = userSchema.validate(req.body)
    if (error) throw { message: error.message, status: 400 }
    
    const { username, password } = value

    const user = await User.findOneByUsername(username)
    if (user) throw { message: 'User already exists', status: 400 }

    const newUser = await User.addOne(username, password)

    res.status(201)
    res.json({ user: newUser })
}))

router.post('/login', asyncWrapper(async (req, res, next) => {
    const { error, value } = userSchema.validate(req.body)
    if (error) throw { message: error.message, status: 400 }

    const { username, password } = value

    const user = await User.findOneByUsername(username)
    if (!user) throw { message: 'User doesn\'t exist', status: 400 }

    const isMatch = await User.matchPassword(password, user.password)
    if (!isMatch) throw { message: 'Username and password don\'t match', status: 400 }

    const token = await User.generateToken(user)
    res.json({ token })
}))



module.exports = router
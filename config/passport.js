const passport = require('passport')
const Strategy = require('passport-http-bearer').Strategy

const User = require('../models/user')

passport.use(new Strategy(async (token, cb) => {
    try {
        const payloadUser = await User.verifyToken(token)
        const user = await User.findOne(payloadUser.id)
        if (!user) cb(null, false)
        cb(null, user)
    } catch (err) {
        err.status = 401
        cb(err)
    }
}))

module.exports = passport
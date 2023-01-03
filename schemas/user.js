const Joi = require('joi')

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(64)
        .required(),
    password: Joi.string()
        .trim()
        .min(4)
        .required()
})

module.exports = schema
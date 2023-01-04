const Joi = require('joi')

const schema = Joi.object({
    topic: Joi.string()
        .trim()
        .min(4)
        .max(255)
        .required(),

    amount: Joi.number()
        .required(),

    urgencyId: Joi.valid(1, 2, 3).required()
})

module.exports = schema
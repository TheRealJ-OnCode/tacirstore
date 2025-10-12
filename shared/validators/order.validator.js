const Joi = require("joi");

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.required': 'Status is required',
            'any.only': 'Invalid status value'
        })
});

module.exports = { updateOrderStatusSchema };
//! order validator for store.(We have order.validator.js named file for this reason i created new file with this name(_s.order.validator.js))
const Joi = require("joi");

const createOrderSchema = Joi.object({
    customerName: Joi.string().trim().required().messages({
        'string.empty': 'Ad-soyad daxil edin',
        'any.required': 'Ad-soyad tələb olunur'
    }),
    
    customerPhone: Joi.string()
        .pattern(/^(\+994|0)[0-9]{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Telefon düzgün formatda deyil (məsələn: 0501234567)',
            'any.required': 'Telefon tələb olunur'
        }),
    
    customerAddress: Joi.string().trim().required().messages({
        'string.empty': 'Ünvan daxil edin',
        'any.required': 'Ünvan tələb olunur'
    }),

    items: Joi.array()
        .items(
            Joi.object({
                variantId: Joi.string().required().messages({
                    'any.required': 'Variant ID tələb olunur'
                }),
                quantity: Joi.number().integer().min(1).required().messages({
                    'number.min': 'Miqdar ən azı 1 olmalıdır',
                    'any.required': 'Miqdar tələb olunur'
                })
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'Ən azı 1 məhsul əlavə edin',
            'any.required': 'Məhsullar tələb olunur'
        }),

    notes: Joi.string().trim().allow('').max(500).messages({
        'string.max': 'Qeyd maksimum 500 simvol ola bilər'
    })
});

module.exports = { createOrderSchema };
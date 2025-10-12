const Joi = require("joi");
const mongoose = require("mongoose");
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.valid')
    }
    return value
}, 'ObjectId validation');
const variantSchema = Joi.object({
    variantName: Joi.string().optional().default("Standart"),
    skus: Joi.array()
        .items(Joi.string().required())
        .min(1) // En az 1 barkod
        .unique() // Array içinde duplicate olmasın
        .required()
        .messages({
            'array.min': 'En az 1 barkod gərəkli',
            'array.unique': 'Barkodlar tekrar edə bilməz'
        }),
    product_sales_price: Joi.number().min(0).required(),
    product_purchase_price: Joi.number().min(0).required(),
    product_count: Joi.number().integer().min(0).required(),
    product_images: Joi.array().items(Joi.string().uri()).default([]),
    discountAmount: Joi.number().min(0).default(0)
})
const variantsArraySchema = Joi.array()
    .items(variantSchema.fork('variantName', (schema) => schema.required()))
    .min(1)
    .required();
const createProductSchema = Joi.object({
    product_name: Joi.string().required(),
    product_company: Joi.string().default("-"),
    product_category: objectId.required(),
    product_description: Joi.string().allow('').default(""),
    product_images: Joi.array().items(Joi.string().uri()).default([]),
    variantType: Joi.string().default("Standart"),
    hasVariants: Joi.boolean().required(),
    isShippingFree: Joi.boolean().default(true),
    shippingCost: Joi.number().min(0).default(0),
    product_unit: objectId.allow(null).optional(),

    variant: Joi.when('hasVariants', {
        is: false,
        then: variantSchema.required(),
        otherwise: Joi.forbidden()
    }),

    variants: Joi.when('hasVariants', {
        is: true,
        then: variantsArraySchema.required(),
        otherwise: Joi.forbidden()
    })
});
const updateProductSchema = Joi.object({
    product_name: Joi.string().optional(),
    product_company: Joi.string().optional(),
    product_category: objectId.optional(),
    product_description: Joi.string().allow('').optional(),
    product_images: Joi.array().items(Joi.string().uri()).optional(),
    variantType: Joi.string().optional(),
    isShippingFree: Joi.boolean().optional(),
    shippingCost: Joi.number().min(0).optional(),
    product_unit: objectId.allow(null).optional(),
    isActive: Joi.boolean().optional(),
    addVariants: Joi.array().items(variantSchema.fork('variantName', (schema) => schema.required())).optional(),
    updateVariants: Joi.array().items(
        Joi.object({
            variantId: objectId.required(),
            variantName: Joi.string().optional(),
            skus: Joi.array().items(Joi.string()).min(1).unique().optional(),
            product_sales_price: Joi.number().min(0).optional(),
            product_purchase_price: Joi.number().min(0).optional(),
            product_count: Joi.number().integer().min(0).optional(),
            product_images: Joi.array().items(Joi.string().uri()).optional(),
            discountAmount: Joi.number().min(0).optional()
        })
    ).optional(),
    deleteVariants: Joi.array().items(objectId).optional()
});

module.exports = { createProductSchema, updateProductSchema };

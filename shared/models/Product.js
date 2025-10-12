const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    product_name: { type: String, required: true, index: true },
    product_company: { type: String, default: "-" },
    product_category: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    product_description: { type: String, default: "" },
    product_images: [{ type: String }],
    variantType: { type: String, default: "Standart" },
    hasVariants: { type: Boolean, default: false },
    isShippingFree: { type: Boolean, default: true },
    shippingCost: { type: Number, default: 0 },
    product_unit: { type: Schema.Types.ObjectId, ref: 'unitDefinitions' },
    isActive : {type:Boolean,default : true}
}, { timestamps: true });


module.exports = model("products", productSchema);
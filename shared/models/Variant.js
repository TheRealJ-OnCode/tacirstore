const { Schema, model } = require("mongoose");

const variantSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true },
    variantName: { type: String, required: true }, 
    skus: [{
        type: String,
        required: true,
        unique: true, 
        sparse: true
    }],// Barkod/SKU
    product_sales_price: { type: Number, required: true },
    product_purchase_price: { type: Number, required: true },
    product_count: { type: Number, required: true }, // Stok
    product_images: [{ type: String }], // Varyant sekli
    discountAmount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0, index: true },
}, { timestamps: true });


variantSchema.index({ productId: 1, variantName: 1 }, { unique: true });
variantSchema.index({ skus: 1 });
module.exports = model("variants", variantSchema);
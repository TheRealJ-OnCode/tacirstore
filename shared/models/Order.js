const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    items: [{
        variantId: { type: Schema.Types.ObjectId, ref: 'variants', required: true },
        productName: { type: String, required: true },
        variantName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: { type: String, default: 'cash_on_delivery' },
    notes: { type: String, default: "" }
}, { timestamps: true });
orderSchema.index({ customerPhone: 1 }); 
orderSchema.index({ status: 1, createdAt: -1 }); 
orderSchema.index({ orderNumber: 1 });

module.exports = model("orders", orderSchema);
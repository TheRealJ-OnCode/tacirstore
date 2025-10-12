const { Order, Variant, Product } = require("@models");

const placeOrderService = async (orderData) => {
    const { items, customerName, customerPhone, customerAddress, notes } = orderData;

    const orderItems = [];
    let subtotal = 0;
    let productIds = new Set(); 
    for (const item of items) {
        const { variantId, quantity } = item;

        const variant = await Variant.findById(variantId);
        
        if (!variant) {
            throw new Error(`Variant tapılmadı: ${variantId}`);
        }

        if (variant.product_count < quantity) {
            throw new Error(
                `${variant.variantName} üçün kifayət qədər stok yoxdur. Mövcud: ${variant.product_count}`
            );
        }

        const product = await Product.findById(variant.productId);
        
        if (!product || !product.isActive) {
            throw new Error(`Məhsul tapılmadı və ya aktiv deyil`);
        }

        productIds.add(product._id.toString());

        const price = variant.product_sales_price - (variant.discountAmount || 0);
        const total = price * quantity;
        subtotal += total;

        orderItems.push({
            variantId: variant._id,
            productName: product.product_name,
            variantName: variant.variantName,
            quantity,
            price,
            total
        });

        variant.product_count -= quantity;
        variant.salesCount = (variant.salesCount || 0) + quantity;
        await variant.save();
    }

    let shippingCost = 0;
    
    for (const productId of productIds) {
        const product = await Product.findById(productId);
        
        if (!product.isShippingFree) {
            shippingCost = Math.max(shippingCost, product.shippingCost || 0);
        }
    }

    const totalAmount = subtotal + shippingCost;
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD-${timestamp}-${random}`;
    const order = await Order.create({
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        items: orderItems,
        subtotal,
        shippingCost,
        totalAmount,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        notes: notes || ''
    });
    return order;
};

module.exports = { placeOrderService };

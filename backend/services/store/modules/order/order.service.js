const { Order, Variant, Product } = require("@models");
const logger = require("@utils/logger"); 

const placeOrderService = async (orderData) => {
    const { items, customerName, customerPhone, customerAddress, notes } = orderData;

    logger.info(`New order attempt - Customer: ${customerName}, Phone: ${customerPhone}`);

    const orderItems = [];
    let subtotal = 0;
    let productIds = new Set();

    for (const item of items) {
        const { variantId, quantity } = item;

        const variant = await Variant.findById(variantId);
        
        if (!variant) {
            logger.error(`Variant not found: ${variantId}`);
            throw new Error(`Variant tapılmadı: ${variantId}`);
        }

        if (variant.product_count < quantity) {
            logger.warn(`Insufficient stock - Variant: ${variant.variantName}, Requested: ${quantity}, Available: ${variant.product_count}`);
            throw new Error(
                `${variant.variantName} üçün kifayət qədər stok yoxdur. Mövcud: ${variant.product_count}`
            );
        }

        const product = await Product.findById(variant.productId);
        
        if (!product || !product.isActive) {
            logger.error(`Product not found or inactive: ${variant.productId}`);
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

        const oldStock = variant.product_count;
        variant.product_count -= quantity;
        variant.salesCount = (variant.salesCount || 0) + quantity;
        await variant.save();

        logger.info(`Stock updated - Variant: ${variant.variantName}, Old: ${oldStock}, New: ${variant.product_count}, Quantity: ${quantity}`);
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

    logger.info(`Order created successfully - Order Number: ${orderNumber}, Total: ${totalAmount} ₼, Items: ${orderItems.length}`);

    return order;
};

module.exports = { placeOrderService };
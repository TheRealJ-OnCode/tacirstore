const asyncHandler = require("express-async-handler");
const { Order, Variant } = require("@models");
const ApiResponse = require("@utils/ApiResponse");
const OrderQueryBuilder = require("@utils/orderQueryBuilder");
const getOrders = asyncHandler(async (req, res) => {
    const result = await new OrderQueryBuilder(Order.find(), req.query)
        .filter()
        .dateRange()
        .search()
        .sort()
        .paginate()
        .execute();

    return ApiResponse.success(res, "Orders Fetched", result);
});
const getOrderDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) {
        return ApiResponse.error(res, "Order not found", null, 404);
    }
    const populatedItems = await Promise.all(
        order.items.map(async (item) => {
            const variant = await Variant.findById(item.variantId)
                .populate('productId')
                .lean();
            return {
                ...item,
                variant: variant ? {
                    _id: variant._id,
                    variantName: variant.variantName,
                    skus: variant.skus,
                    product_images: variant.product_images,
                    product: variant.productId ? {
                        _id: variant.productId._id,
                        product_name: variant.productId.product_name,
                        product_company: variant.productId.product_company
                    } : null
                } : null
            };
        })
    );
    
    return ApiResponse.success(res, "Order Detail Fetched", {
        ...order,
        items: populatedItems
    });
});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!status) {
        return ApiResponse.error(res, "Status is required", null, 400);
    }
    
    if (!validStatuses.includes(status)) {
        return ApiResponse.error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, null, 400);
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
        return ApiResponse.error(res, "Order not found", null, 404);
    }
    
    const oldStatus = order.status;
    
    order.status = status;
    await order.save();
    
    return ApiResponse.success(res, "Order Status Updated", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus: status
    });
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
        return ApiResponse.error(res, "Order not found", null, 404);
    }
    
    if (order.status === 'cancelled') {
        return ApiResponse.error(res, "Order is already cancelled", null, 400);
    }
    
    if (order.status === 'delivered') {
        return ApiResponse.error(res, "Delivered orders cannot be cancelled", null, 400);
    }
    
    if (order.status === 'pending' || order.status === 'confirmed') {
        for (const item of order.items) {
            await Variant.findByIdAndUpdate(
                item.variantId,
                { $inc: { product_count: item.quantity } }, 
            );
        }
    }
    
    order.status = 'cancelled';
    await order.save();
    
    return ApiResponse.success(res, "Order Cancelled Successfully", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        stockRestored: order.status === 'pending' || order.status === 'confirmed'
    });
});
module.exports = { getOrders, getOrderDetail, updateOrderStatus, cancelOrder }
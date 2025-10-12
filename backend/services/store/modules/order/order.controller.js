const asyncHandler = require("express-async-handler");
const ApiResponse = require("@utils/ApiResponse");
const { Order } = require("@models")
const createOrder = asyncHandler(async (req, res) => {
    try {
        const order = await placeOrderService(req.body);
        return ApiResponse.success(res, "Sipariş yaradıldı", order, 201);
    } catch (error) {
        return ApiResponse.error(res, error.message, null, 400);
    }
});
const getOrderByNumber = asyncHandler(async (req, res) => {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    if (!phone) {
        return ApiResponse.error(res, "Phone number required", null, 400);
    }

    const order = await Order.findOne({
        orderNumber,
        customerPhone: phone
    });

    if (!order) {
        return ApiResponse.error(res, "Order not found", null, 404);
    }

    return ApiResponse.success(res, "Order Fetched", order);

})
module.exports = { createOrder, getOrderByNumber }
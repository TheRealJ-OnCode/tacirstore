const { getOrders, getOrderDetail, updateOrderStatus, cancelOrder } = require("./order.controller");
const { validateId } = require("@validators/id.validator");
const { updateOrderStatusSchema } = require("@validators/order.validator");
const validate = require("@middlewares/validate");

const r = require("express").Router();
// ! GET Orders
r.get("/orders",getOrders);
// ! GET Order Detail
r.get("/orders/:id",validateId,getOrderDetail);
// ! PUT /orders/:id/status 
r.put("/orders/:id/status",validateId,validate(updateOrderStatusSchema),updateOrderStatus);
// ! DELETE /orders/:id - Sipariş iptal
r.delete("/orders/:id",validateId,cancelOrder)



module.exports = r;
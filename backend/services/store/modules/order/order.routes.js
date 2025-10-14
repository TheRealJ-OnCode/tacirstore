const r = require("express").Router();
const {validateId} = require("../../../../../shared/validators/id.validator");
const { getOrderByNumber, createOrder } = require("./order.controller");
const validate = require("../../../../../shared/middlewares/validate");
const { createOrderSchema } = require("../../../../../shared/validators/_s.order.validator");
r.post("/orders",validate(createOrderSchema), createOrder);
r.get("/orders/:orderNumber", getOrderByNumber);


module.exports = r
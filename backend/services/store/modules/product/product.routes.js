const r = require("express").Router();


const { getProducts, getProductDetails } = require("../product/product.controller");
const {validateId} = require("../../../../../shared/validators/id.validator")

r.get("/products", getProducts);
r.get("/products/:id", validateId, getProductDetails)

module.exports = r
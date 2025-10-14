const { createProduct, getProducts, getProductDetail, updateProduct, deleteProduct } = require("./product.controller");
const { validateId } = require("../../../../../shared/validators/id.validator");
const { createProductSchema } = require("../../../../../shared/validators/product.validators");
const { updateProductSchema } = require("../../../../../shared/validators/product.validators");
const validate = require("../../../../../shared/middlewares/validate");
const r = require("express").Router();
//! CREATE product
r.post("/products",validate(createProductSchema),createProduct)
//! GET products;
r.get("/products",getProducts)
//! DETAIL of one product
r.get("/products/:id",validateId,getProductDetail)
//! UPDATE product
r.put("/products/:id", validateId, validate(updateProductSchema), updateProduct);
//! DELETE product 
r.delete("/products/:id",deleteProduct)

module.exports = r;
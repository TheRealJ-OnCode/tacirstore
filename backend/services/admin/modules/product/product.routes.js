const { createProduct, getProducts, getProductDetail, updateProduct, deleteProduct } = require("./product.controller");
const { validateId } = require("@validators/id.validator");
const { createProductSchema } = require("@validators/product.validators");
const { updateProductSchema } = require("@validators/product.validators");
const validate = require("@middlewares/validate");
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
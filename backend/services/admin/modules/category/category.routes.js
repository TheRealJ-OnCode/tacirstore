const { 
    getCategories, 
    getCategoryDetail,
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require("./category.controller");
const { validateId } = require("@validators/id.validator");

const r = require("express").Router();

r.get("/categories", getCategories);
r.get("/categories/:id", validateId, getCategoryDetail);
r.post("/categories", createCategory);
r.put("/categories/:id", validateId, updateCategory);
r.delete("/categories/:id", validateId, deleteCategory);

module.exports = r;
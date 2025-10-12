const { getCategories } = require("./category.controller");

const r = require("express").Router();
    
r.get("/categories", getCategories);

module.exports = r
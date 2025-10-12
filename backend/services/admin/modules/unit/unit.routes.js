const { 
    getUnits, 
    getUnitDetail,
    createUnit, 
    updateUnit, 
    deleteUnit 
} = require("./unit.controller");
const { validateId } = require("@validators/id.validator");

const r = require("express").Router();

r.get("/units", getUnits);
r.get("/units/:id", validateId, getUnitDetail);
r.post("/units", createUnit);
r.put("/units/:id", validateId, updateUnit);
r.delete("/units/:id", validateId, deleteUnit);

module.exports = r;
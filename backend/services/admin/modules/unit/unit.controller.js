const asyncHandler = require("express-async-handler");
const { UnitDefinition } = require("../../../../../shared/models");
const ApiResponse = require("../../../../../shared/utils/ApiResponse");

const getUnits = asyncHandler(async (req, res) => {
    const units = await UnitDefinition.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, "Units Fetched", units);
});

const getUnitDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const unit = await UnitDefinition.findById(id);
    
    if (!unit) {
        return ApiResponse.error(res, "Unit not found", null, 404);
    }
    
    return ApiResponse.success(res, "Unit Fetched", unit);
});

const createUnit = asyncHandler(async (req, res) => {
    const { name, baseUnit, conversionRate, isActive } = req.body;
    
    const unit = await new UnitDefinition({
        name,
        baseUnit,
        conversionRate,
        isActive
    }).save();
    
    return ApiResponse.success(res, "Unit Created", unit, 201);
});

const updateUnit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const unit = await UnitDefinition.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    
    if (!unit) {
        return ApiResponse.error(res, "Unit not found", null, 404);
    }
    
    return ApiResponse.success(res, "Unit Updated", unit);
});

const deleteUnit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const unit = await UnitDefinition.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    
    if (!unit) {
        return ApiResponse.error(res, "Unit not found", null, 404);
    }
    
    return ApiResponse.success(res, "Unit Deleted", { id });
});

module.exports = {
    getUnits,
    getUnitDetail,
    createUnit,
    updateUnit,
    deleteUnit
};
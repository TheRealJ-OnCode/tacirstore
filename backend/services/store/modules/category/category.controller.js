const { Category } = require("../../../../../shared/models");
const ApiResponse = require("../../../../../shared/utils/ApiResponse");
const asyncHandler = require("express-async-handler");

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({isActive:true}).sort({ createdAt: -1 });
    return ApiResponse.success(res, "Categories Fetched", categories);
});

module.exports = {getCategories}
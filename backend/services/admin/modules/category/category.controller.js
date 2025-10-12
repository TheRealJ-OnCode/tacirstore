const asyncHandler = require("express-async-handler");
const { Category } = require("@models");
const ApiResponse = require("@utils/ApiResponse");

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, "Categories Fetched", categories);
});

const getCategoryDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
        return ApiResponse.error(res, "Category not found", null, 404);
    }
    
    return ApiResponse.success(res, "Category Fetched", category);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, isActive } = req.body;
    
    const category = await new Category({
        name,
        description,
        isActive
    }).save();
    
    return ApiResponse.success(res, "Category Created", category, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    
    if (!category) {
        return ApiResponse.error(res, "Category not found", null, 404);
    }
    
    return ApiResponse.success(res, "Category Updated", category);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const category = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    
    if (!category) {
        return ApiResponse.error(res, "Category not found", null, 404);
    }
    
    return ApiResponse.success(res, "Category Deleted", { id });
});

module.exports = {
    getCategories,
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory
};
const ApiResponse = require("@utils/ApiResponse");
const asyncHandler = require("express-async-handler");
const { Product ,Variant} = require("@models");
const QueryBuilder = require("@utils/queryBuilder");

const getProducts = asyncHandler(async (req, res) => {
    const result = await new QueryBuilder(Product.find(), req.query)
        .filter()
        .search()
        .sort()
        .paginate()
        .execute()
    return ApiResponse.success(res, "All Products Fetched", result);

})
const getProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);

    if (!product || !product.isActive) {
        return ApiResponse.error(res, "Product not found", null, 404);
    }
    const variants = await Variant.find({ productId: id }).sort({ salesCount: -1 });

    return ApiResponse.success(res, "Product Fetched", { product, variants });

})
module.exports = { getProducts, getProductDetails }
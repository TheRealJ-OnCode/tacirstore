const ApiResponse = require("../../../../../shared/utils/ApiResponse");
const asyncHandler = require("express-async-handler");
const { Product ,Variant} = require("../../../../../shared/models");
const QueryBuilder = require("../../../../../shared/utils/queryBuilder");
const getProducts = asyncHandler(async (req, res) => {
    const result = await new QueryBuilder(Product.find({ isActive: true }), req.query)
        .filter()
        .search()
        .sort()
        .paginate()
        .execute();

    // Hər məhsul üçün ilk variantı əlavə et
    const productsWithVariants = await Promise.all(
        result.products.map(async (product) => {
            const firstVariant = await Variant.findOne({ 
                productId: product._id,
                product_count: { $gt: 0 } 
            })
            .sort({ product_sales_price: 1 })
            .select('variantName product_sales_price discountAmount product_count salesCount');

            return {
                ...product,
                variant: firstVariant ? {
                    _id: firstVariant._id,
                    variantName: firstVariant.variantName,
                    product_sales_price: firstVariant.product_sales_price,
                    discountAmount: firstVariant.discountAmount || 0,
                    product_count: firstVariant.product_count,
                    salesCount: firstVariant.salesCount || 0
                } : null
            };
        })
    );

    return ApiResponse.success(res, "All Products Fetched", {
        ...result,
        products: productsWithVariants
    });
});

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
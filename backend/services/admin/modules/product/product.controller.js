const asyncHandler = require("express-async-handler");
const { Product, Variant } = require("../../../../../shared/models")
const ApiResponse = require("../../../../../shared/utils/ApiResponse");
const QueryBuilder = require("../../../../../shared/utils/queryBuilder");
const { updateProductService } = require("./product.service");
const createProduct = asyncHandler(async (req, res) => {
    const data = req.body
    const { hasVariants, variant, variants, ...productData } = data;
    const product = await new Product(productData).save();
    let createdVariants = [];
    if (hasVariants) {
        const variantsToCreate = variants.map(v => ({
            productId: product._id,
            ...v
        }))
        createdVariants = await Variant.insertMany(variantsToCreate);
    } else {
        const singleVariant = await new Variant({
            productId:product._id,
            variantName : "Standart",
            ...variant
        }).save();
        createdVariants = [singleVariant]
    }
    return ApiResponse.success(res,"Product Created",{product,createdVariants},201)
});
const getProducts = asyncHandler(async (req, res) => {
    const result = await new QueryBuilder(Product.find(),req.query)
    .filter()
    .search()
    .sort()
    .paginate()
    .execute()
    return ApiResponse.success(res, "All Products Fetched", result);

});
const getProductDetail = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    
    if (!product || !product.isActive) {
        return ApiResponse.error(res, "Product not found", null, 404);
    }
    const variants = await Variant.find({productId:id}).sort({ salesCount: -1 });

    return ApiResponse.success(res, "Product Fetched", {product,variants});

});
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!product) return ApiResponse.error(res, "Product not found!", {}, 404);
    return ApiResponse.success(res, "Product Deleted", { id });
}
);

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateProductService(id, req.body);
    return ApiResponse.success(res, "Product Updated", result);
});
module.exports = {
    createProduct, getProducts, getProductDetail,
    deleteProduct, updateProduct
}
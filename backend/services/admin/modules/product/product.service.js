const {Product,Variant} = require("../../../../../shared/models")

const updateProductService = async (productId, data) => {
    const { addVariants, updateVariants, deleteVariants, ...productData } = data;
    
    let product = null;
    if (Object.keys(productData).length > 0) {
        product = await Product.findByIdAndUpdate(
            productId, 
            productData, 
            { new: true }
        );
        
        if (!product) {
            throw new Error("Product not found");
        }
    } else {
        product = await Product.findById(productId);
    }
    
    let addedVariants = [];
    if (addVariants && addVariants.length > 0) {
        const variantsToAdd = addVariants.map(v => ({
            productId,
            ...v
        }));
        addedVariants = await Variant.insertMany(variantsToAdd);
    }
    
    let updatedVariants = [];
    if (updateVariants && updateVariants.length > 0) {
        for (const variantUpdate of updateVariants) {
            const { variantId, ...updateData } = variantUpdate;
            const updated = await Variant.findByIdAndUpdate(
                variantId,
                updateData,
                { new: true }
            );
            if (updated) {
                updatedVariants.push(updated);
            }
        }
    }
    
    let deletedCount = 0;
    if (deleteVariants && deleteVariants.length > 0) {
        const result = await Variant.deleteMany({
            _id: { $in: deleteVariants },
            productId
        });
        deletedCount = result.deletedCount;
    }
    
    const currentVariants = await Variant.find({ productId });
    
    return {
        product,
        variants: currentVariants,
        changes: {
            added: addedVariants.length,
            updated: updatedVariants.length,
            deleted: deletedCount
        }
    };
};

module.exports = {  updateProductService };
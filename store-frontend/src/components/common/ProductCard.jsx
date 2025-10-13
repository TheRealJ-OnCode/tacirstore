import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const mainImage = product.product_images?.[0] || 'https://via.placeholder.com/300';
  const hasDiscount = product.variant?.discountAmount > 0;
  const price = product.variant?.product_sales_price || 0;
  const finalPrice = hasDiscount ? price - product.variant.discountAmount : price;
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={mainImage}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.variant.discountAmount} ₼
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/products/${product._id}`}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Company */}
        {product.product_company && (
          <p className="text-xs text-gray-500 mb-1">{product.product_company}</p>
        )}

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.product_name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">
            {finalPrice.toFixed(2)} ₼
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {price.toFixed(2)} ₼
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Link
          to={`/products/${product._id}`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          <ShoppingCart size={18} />
          <span>Səbətə At</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

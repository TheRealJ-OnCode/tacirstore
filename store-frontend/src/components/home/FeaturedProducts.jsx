import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";
import ProductCard from "../common/ProductCard";
import toast from "react-hot-toast";
import SkeletonCard from '../common/SkeletonCard';
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 8, sort: "-createdAt" });
      setProducts(response.data.data.products || []);
    } catch (error) {
      toast.error("Məhsullar yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-10 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Yeni Məhsullar
            </h2>
            <p className="text-gray-600">
              Ən son əlavə edilən məhsullarımızı kəşf edin
            </p>
          </div>

          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            <span>Hamısını Gör</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Məhsul tapılmadı
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

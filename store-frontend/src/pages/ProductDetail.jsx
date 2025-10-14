import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import SEO from "../components/common/SEO";
import { getProduct } from "../services/api";
import { useCart } from "../hooks/useCart";
import ProductSEO from '../components/common/ProductSEO';
import {
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCart((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      const data = response.data.data;

      setProduct(data.product);
      setVariants(data.variants || []);

      // İlk variantı seç
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (error) {
      toast.error("Məhsul yüklənmədi");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Variant seçin");
      return;
    }

    if (quantity > selectedVariant.product_count) {
      toast.error("Stokda kifayət qədər məhsul yoxdur");
      return;
    }

    addItem(selectedVariant, product, quantity);
    toast.success("Səbətə əlavə edildi", {
      icon: "🛒",
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (
      newQuantity >= 1 &&
      newQuantity <= (selectedVariant?.product_count || 1)
    ) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-gray-600">Məhsul tapılmadı</p>
          </div>
        </div>
      </Layout>
    );
  }

  const images =
    selectedVariant?.product_images?.length > 0
      ? selectedVariant.product_images
      : product.product_images || [];

  const hasDiscount = selectedVariant?.discountAmount > 0;
  const price = selectedVariant?.product_sales_price || 0;
  const finalPrice = hasDiscount
    ? price - selectedVariant.discountAmount
    : price;

  return (
    <Layout>
      <SEO
        title={product.product_name}
        description={
          product.product_description ||
          `${product.product_name} - Tacir Store'da sifariş edin`
        }
        keywords={`${product.product_name}, ${
          product.product_company || ""
        }, online alış-veriş`}
        image={images[0]}
        type="product"
      />
       <ProductSEO product={product} variants={variants} />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Geri</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Images */}
            <div>
              {/* Main Image */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4 aspect-square">
                <img
                  src={
                    images[selectedImage] || "https://via.placeholder.com/600"
                  }
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.product_name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div>
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                {/* Company */}
                {product.product_company && (
                  <p className="text-sm text-gray-500 mb-2">
                    {product.product_company}
                  </p>
                )}

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.product_name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    {finalPrice.toFixed(2)} ₼
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {price.toFixed(2)} ₼
                      </span>
                      <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-bold">
                        -{selectedVariant.discountAmount} ₼
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.product_description && (
                  <div className="mb-6 pb-6 border-b">
                    <p className="text-gray-600 leading-relaxed">
                      {product.product_description}
                    </p>
                  </div>
                )}

                {/* Variants */}
                {variants.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      {product.variantType || "Variant"} Seç:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant._id}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setQuantity(1);
                            setSelectedImage(0);
                          }}
                          disabled={variant.product_count === 0}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                            selectedVariant?._id === variant._id
                              ? "border-primary bg-primary text-white"
                              : variant.product_count === 0
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          {variant.variantName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-6">
                  {selectedVariant?.product_count > 0 ? (
                    <p className="text-green-600 font-medium">
                      ✓ Stokda var ({selectedVariant.product_count} ədəd)
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">✗ Stokda yoxdur</p>
                  )}
                </div>

                {/* Quantity */}
                {selectedVariant?.product_count > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Miqdar:
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="p-3 hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="px-6 py-2 font-bold text-lg">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= selectedVariant.product_count}
                          className="p-3 hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="text-lg font-bold text-gray-900">
                        Toplam: {(finalPrice * quantity).toFixed(2)} ₼
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant || selectedVariant.product_count === 0
                  }
                  className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={24} />
                  <span>Səbətə Əlavə Et</span>
                </button>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Çatdırılma</p>
                      <p className="text-xs text-gray-500">
                        {product.isShippingFree
                          ? "Pulsuz"
                          : `${product.shippingCost} ₼`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Keyfiyyət</p>
                      <p className="text-xs text-gray-500">Zəmanət</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Qaytarma</p>
                      <p className="text-xs text-gray-500">14 gün</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;

import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import SEO from "../components/common/SEO";
import { useCart } from "../hooks/useCart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const MINIMUM_ORDER_AMOUNT = 20; 
  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // ← YENİ: Minimum yoxlama
    if (total < MINIMUM_ORDER_AMOUNT) {
      return; // Düymə zaten disabled
    }
    
    setCheckoutLoading(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 300);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <SEO title="Səbət" description="Alış-veriş səbətiniz" />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Səbətiniz Boşdur
            </h2>
            <p className="text-gray-600 mb-8">
              Hələ heç bir məhsul əlavə etməmisiniz
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <span>Məhsullara Bax</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Səbət" description="Alış-veriş səbətiniz" />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Səbət ({items.length})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.variantName}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="p-2 hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {item.price.toFixed(2)} ₼ × {item.quantity}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {(item.price * item.quantity).toFixed(2)} ₼
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full md:w-auto px-6 py-3 text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Səbəti Təmizlə
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Sifariş Xülasəsi
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara toplam:</span>
                    <span className="font-semibold">
                      {total.toFixed(2)} ₼
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Çatdırılma:</span>
                    <span className="font-semibold text-green-600">
                      Hesablanacaq
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Toplam:</span>
                    <span className="text-2xl font-bold text-primary">
                      {total.toFixed(2)} ₼
                    </span>
                  </div>
                </div>

                {/* ← YENİ: Minimum Uyarı */}
                {total < MINIMUM_ORDER_AMOUNT && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <span className="font-bold">Minimum sifariş: {MINIMUM_ORDER_AMOUNT} ₼</span>
                      <br />
                      Daha <span className="font-bold text-primary">{(MINIMUM_ORDER_AMOUNT - total).toFixed(2)} ₼</span> məhsul əlavə edin.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || total < MINIMUM_ORDER_AMOUNT}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  {checkoutLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Yüklənir...</span>
                    </>
                  ) : (
                    <>
                      <span>Sifarişi Tamamla</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-4 text-primary font-semibold hover:underline"
                >
                  ← Alış-verişə Davam Et
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
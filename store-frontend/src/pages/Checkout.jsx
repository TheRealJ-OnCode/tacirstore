import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/common/SEO';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/api';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Əgər səbət boşdursa, cart'a yönləndir
  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Ad-soyad daxil edin';
    }

    const phoneRegex = /^(\+994|0)[0-9]{9}$/;
    if (!phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Düzgün telefon nömrəsi daxil edin (məsələn: 0501234567)';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Ünvan daxil edin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Formu düzgün doldurun');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        ...formData,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);
      const order = response.data.data;

      setOrderNumber(order.orderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success('Sifarişiniz qəbul edildi!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Xətanı təmizlə
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Order Complete Screen
  if (orderComplete) {
    return (
      <Layout>
        <SEO title="Sifariş Tamamlandı" />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sifarişiniz Qəbul Edildi!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Tezliklə sizinlə əlaqə saxlayacağıq
            </p>

            <div className="bg-light rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Sifariş Nömrəniz:</p>
              <p className="text-2xl font-bold text-primary font-mono">
                {orderNumber}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Sifarişi İzləmək Üçün:
              </h3>
              <ol className="text-left text-gray-600 space-y-2">
                <li>1. Sipariş nömrənizi yadda saxlayın</li>
                <li>2. Qeydiyyat telefon nömrənizi hazır edin</li>
                <li>3. "Sipariş Takibi" səhifəsindən yoxlayın</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/order-tracking')}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Sifarişi İzlə
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Ana Səhifəyə Qayıt
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Sifariş Formu" />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Səbətə Qayıt</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Sifariş Formu
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Əlaqə Məlumatları
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad və Soyad *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.customerName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary'
                      }`}
                      placeholder="Adınızı daxil edin"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Nömrəsi *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.customerPhone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary'
                      }`}
                      placeholder="0501234567"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çatdırılma Ünvanı *
                    </label>
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.customerAddress
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary'
                      }`}
                      placeholder="Ismayıllı, Nəsimi rayonu, 28 May küçəsi..."
                    />
                    {errors.customerAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qeydlər (İstəyə Bağlı)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="Saat 18:00'dan sonra çatdırın..."
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Sifariş Xülasəsi
                </h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} ₼
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Toplam:</span>
                    <span className="text-2xl font-bold text-primary">
                      {getTotal().toFixed(2)} ₼
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    * Çatdırılma qiyməti sonra hesablanacaq
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Göndərilir...' : 'Sifarişi Təsdiqlə'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
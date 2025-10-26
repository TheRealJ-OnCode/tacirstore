import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/common/SEO";
import { getOrder } from "../services/api";
import { Search, Package, CheckCircle, Truck, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner"
const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusIcons = {
    pending: Package,
    confirmed: CheckCircle,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  };

  const statusColors = {
    pending: "text-yellow-600 bg-yellow-100",
    confirmed: "text-blue-600 bg-blue-100",
    shipped: "text-purple-600 bg-purple-100",
    delivered: "text-green-600 bg-green-100",
    cancelled: "text-red-600 bg-red-100",
  };

  const statusLabels = {
    pending: "Gözləyir",
    confirmed: "Təsdiqləndi",
    shipped: "Yoldadır",
    delivered: "Çatdırıldı",
    cancelled: "Ləğv Edildi",
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim() || !phone.trim()) {
      toast.error("Sipariş nömrəsi və telefon daxil edin");
      return;
    }

    try {
      setLoading(true);
      const response = await getOrder(orderNumber, phone);
      setOrder(response.data.data);
    } catch (error) {
      toast.error("Sipariş tapılmadı");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <SEO
        title="Sipariş Takibi"
        description="Siparişinizin statusunu yoxlayın"
      />

      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Sipariş Takibi
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Siparişinizin statusunu yoxlamaq üçün məlumatları daxil edin
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm mb-8"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sipariş Nömrəsi
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="ORD-1234567890-123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Nömrəsi
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="0501234567"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Axtarılır...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Yoxla</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Order Details */}
            {order && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Status */}
                <div className={`p-6 ${statusColors[order.status]}`}>
                  <div className="flex items-center justify-center gap-3">
                    {(() => {
                      const Icon = statusIcons[order.status];
                      return <Icon size={32} />;
                    })()}
                    <div className="text-center">
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-2xl font-bold">
                        {statusLabels[order.status]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Sipariş Nömrəsi</p>
                      <p className="font-mono font-bold">{order.orderNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Müştəri</p>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {order.customerPhone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Ünvan</p>
                      <p className="text-gray-900">{order.customerAddress}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Sifariş Tarixi</p>
                      <p className="text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Məhsullar</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              {item.variantName} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">{item.total} ₼</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t mt-6 pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Ara toplam:</span>
                        <span>{order.subtotal} ₼</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Çatdırılma:</span>
                        <span>{order.shippingCost} ₼</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold border-t pt-2">
                        <span>Toplam:</span>
                        <span className="text-primary">
                          {order.totalAmount} ₼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-6 p-4 bg-light rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Qeyd:
                      </p>
                      <p className="text-gray-600">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;

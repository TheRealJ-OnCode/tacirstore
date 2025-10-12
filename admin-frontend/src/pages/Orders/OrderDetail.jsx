import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Package, XCircle } from 'lucide-react';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Gözləyən', color: 'yellow' },
    { value: 'confirmed', label: 'Təsdiqlənmiş', color: 'blue' },
    { value: 'shipped', label: 'Göndərilmiş', color: 'purple' },
    { value: 'delivered', label: 'Çatdırılmış', color: 'green' },
    { value: 'cancelled', label: 'Ləğv edilmiş', color: 'red' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      toast.error('Sipariş yüklənmədi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await orderService.updateOrderStatus(id, newStatus);
      toast.success('Status yeniləndi');
      fetchOrder();
    } catch (error) {
      toast.error('Status yenilənmədi');
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Sifarişi ləğv etmək istədiyinizdən əminsiniz?')) return;

    try {
      await orderService.cancelOrder(id);
      toast.success('Sipariş ləğv edildi');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xəta baş verdi');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yüklənir...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Sipariş tapılmadı</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sipariş Detayları</h1>
            <p className="text-gray-500 font-mono">{order.orderNumber}</p>
          </div>
        </div>
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <button
            onClick={handleCancelOrder}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <XCircle size={20} />
            Ləğv et
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol tərəf - Əsas məlumatlar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Məhsullar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Məhsullar</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Məhsul</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Varyant</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qiymət</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Say</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              {item.variant.product?.product_company}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.variantName}</td>
                      <td className="px-4 py-3 text-right">{item.price} ₼</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-semibold">{item.total} ₼</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Qiymət Breakdown */}
            <div className="mt-6 border-t pt-4">
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
                  <span>{order.totalAmount} ₼</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ tərəf - Status və müştəri */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className={`px-4 py-3 rounded-lg border-2 mb-4 ${statusColors[order.status]}`}>
              <p className="text-center font-semibold">
                {statusOptions.find(s => s.value === order.status)?.label}
              </p>
            </div>
            
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status dəyişdir:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions
                    .filter(s => s.value !== 'cancelled')
                    .map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Müştəri */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Müştəri Məlumatları</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Ad Soyad</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Ünvan</p>
                  <p className="font-medium">{order.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarix */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Tarixlər</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Yaradılma:</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Son yeniləmə:</p>
                <p className="font-medium">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Qeydlər */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Qeydlər</h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
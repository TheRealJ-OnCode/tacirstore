import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      thisMonthRevenue: 0,
      thisWeekRevenue: 0,
      todayRevenue: 0,
      pendingOrders: 0,
    },
    statusBreakdown: [],
    recentOrders: [],
    topProducts: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://tacirstore-copy-production.up.railway.app/api/admin/v1/dashboard');
      setData(response.data.data);
    } catch (error) {
      toast.error('Dashboard yüklənmədi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    pending: 'Gözləyən',
    confirmed: 'Təsdiqlənmiş',
    shipped: 'Göndərilmiş',
    delivered: 'Çatdırılmış',
    cancelled: 'Ləğv edilmiş',
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'short',
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

  const { stats, statusBreakdown, recentOrders, topProducts } = data;
  const totalOrdersForPercentage = statusBreakdown.reduce((sum, s) => sum + s.count, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">İdarə Paneli</h1>
        <p className="text-gray-500">Xoş gəldiniz! Əsas statistikalar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {/* Toplam Məhsul */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Toplam Məhsul</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Toplam Sipariş */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Toplam Sipariş</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Bu Ayın Gəliri */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bu Ayın Gəliri</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.thisMonthRevenue.toFixed(2)} ₼</p>
              <p className="text-xs text-gray-400 mt-1">Bu həftə: {stats.thisWeekRevenue.toFixed(2)} ₼</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Pending Siparişlər */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gözləyən Siparişlər</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-400 mt-1">Bu gün: {stats.todayRevenue.toFixed(2)} ₼</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Siparişlər */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Son Siparişlər</h3>
          </div>
           
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş №</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müştəri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Məbləğ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Sipariş yoxdur
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4 font-semibold">{order.totalAmount} ₼</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ tərəf */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Status Bölgüsü</h3>
            <div className="space-y-3">
              {statusBreakdown.map((status) => {
                const percentage =
                  totalOrdersForPercentage > 0 ? ((status.count / totalOrdersForPercentage) * 100).toFixed(1) : 0;
                return (
                  <div key={status._id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{statusLabels[status._id]}</span>
                      <span className="text-sm font-semibold">
                        {status.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status._id]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ən Çox Satılanlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ən Çox Satılanlar</h3>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Məlumat yoxdur</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {product.productId?.product_name || 'Silinmiş məhsul'}
                        </p>
                        <p className="text-xs text-gray-500">{product.variantName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{product.salesCount} satış</p>
                      <p className="text-xs text-gray-500">{product.product_sales_price} ₼</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
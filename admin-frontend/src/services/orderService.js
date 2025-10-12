import api from '../api/axios';

const orderService = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.delete(`/orders/${id}`),
};

export default orderService; // ← BU SATIR
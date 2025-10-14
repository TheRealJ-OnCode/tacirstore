import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://tacirstore-production.up.railway.app/api/store/v1/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getOrder = (orderNumber, phone) => 
  api.get(`/orders/${orderNumber}`, { params: { phone } });

export default api;
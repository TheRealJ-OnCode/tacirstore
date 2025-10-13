import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (sonra auth token ekleyeceğiz)
api.interceptors.request.use(
  (config) => {
    // Token varsa ekle
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (hata yakalama)
api.interceptors.response.use(
  (response) => response.data, // { success, message, data }
  (error) => {
    const message = error.response?.data?.message || 'Bir hata oluştu';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
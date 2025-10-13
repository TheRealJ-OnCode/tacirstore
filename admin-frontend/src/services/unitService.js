import api from '../api/axios';

const unitService = {
  getUnits: () => api.get('/units'),
  getUnit: (id) => api.get(`/units/${id}`),
  createUnit: (data) => api.post('/units', data),
  updateUnit: (id, data) => api.put(`/units/${id}`, data),
  deleteUnit: (id) => api.delete(`/units/${id}`),
};

export default unitService; // ← BU SATIR
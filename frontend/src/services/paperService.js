import api from './api';

// Normalize DRF paginated response to plain array
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const paperService = {
  async getPapers(params = {}) {
    const response = await api.get('/papers/', { params });
    return toArray(response.data);
  },

  async getPaper(id) {
    const response = await api.get(`/papers/${id}/`);
    return response.data;
  },

  async submitPaper(formData) {
    const response = await api.post('/papers/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updatePaper(id, data) {
    const response = await api.patch(`/papers/${id}/`, data);
    return response.data;
  },

  async deletePaper(id) {
    await api.delete(`/papers/${id}/`);
  },

  async getCategories() {
    const response = await api.get('/papers/categories/');
    return toArray(response.data);
  },

  async getAuthors(paperId) {
    const response = await api.get(`/papers/${paperId}/authors/`);
    return toArray(response.data);
  },

  async addAuthor(paperId, authorData) {
    const response = await api.post(`/papers/${paperId}/authors/`, authorData);
    return response.data;
  },

  async getPayment(paperId) {
    const response = await api.get(`/papers/${paperId}/payment/`);
    return response.data;
  },

  async uploadPaymentProof(paperId, formData) {
    const response = await api.post(
      `/papers/${paperId}/payment/upload-proof/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  async verifyPayment(paperId, action, notes = '') {
    const response = await api.post(`/papers/${paperId}/payment/verify/`, {
      action,
      notes,
    });
    return response.data;
  },

  async processPdf(paperId) {
    const response = await api.post(`/papers/${paperId}/process-pdf/`);
    return response.data;
  },
};

export default paperService;

import api from './api';

export const paperService = {
  async getPapers(params = {}) {
    const response = await api.get('/papers/', { params });
    return response.data;
  },

  async getPaper(id) {
    const response = await api.get(`/papers/${id}/`);
    return response.data;
  },

  async submitPaper(paperData) {
    const response = await api.post('/papers/', paperData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updatePaper(id, paperData) {
    const response = await api.patch(`/papers/${id}/`, paperData);
    return response.data;
  },

  async searchPapers(query, filters = {}) {
    const response = await api.get('/papers/search/', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  async submitReview(paperId, reviewData) {
    const response = await api.post(`/papers/${paperId}/reviews/`, reviewData);
    return response.data;
  },

  async getReviews(paperId) {
    const response = await api.get(`/papers/${paperId}/reviews/`);
    return response.data;
  },

  async updateDecision(paperId, decision) {
    const response = await api.post(`/papers/${paperId}/decision/`, { decision });
    return response.data;
  },
};

export default paperService;

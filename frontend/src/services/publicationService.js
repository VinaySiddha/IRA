import api from './api';

const publicationService = {
  async getStatus(paperId) {
    const response = await api.get(`/publication/${paperId}/`);
    return response.data;
  },

  async generateDoi(paperId) {
    const response = await api.post(`/publication/${paperId}/generate-doi/`);
    return response.data;
  },

  async publish(paperId) {
    const response = await api.post(`/publication/${paperId}/publish/`);
    return response.data;
  },

  async updateStatus(paperId, data) {
    const response = await api.patch(`/publication/${paperId}/`, data);
    return response.data;
  },
};

export default publicationService;

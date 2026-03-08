import api from './api';

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const reviewService = {
  async assign(paperId, reviewerId) {
    const response = await api.post('/reviews/assign/', {
      paper_id: paperId,
      reviewer_id: reviewerId,
    });
    return response.data;
  },

  async submit(reviewId, data) {
    const response = await api.put(`/reviews/${reviewId}/submit/`, data);
    return response.data;
  },

  async myAssignments() {
    const response = await api.get('/reviews/my-assignments/');
    return toArray(response.data);
  },

  async getDecisions(paperId = null) {
    const url = paperId
      ? `/reviews/decisions/paper/${paperId}/`
      : '/reviews/decisions/';
    const response = await api.get(url);
    return toArray(response.data);
  },

  async createDecision(data) {
    const response = await api.post('/reviews/decisions/', data);
    return response.data;
  },
};

export default reviewService;

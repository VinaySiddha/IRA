import api from './api';

const plagiarismService = {
  async checkPaper(paperId) {
    const response = await api.post(`/plagiarism/check/${paperId}/`);
    return response.data;
  },

  async getReport(paperId) {
    const response = await api.get(`/plagiarism/report/${paperId}/`);
    return response.data;
  },
};

export default plagiarismService;

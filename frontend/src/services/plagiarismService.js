import api from './api';

const plagiarismService = {
  async checkPaper(paperId, includeWebCheck = false) {
    const response = await api.post(`/plagiarism/check/${paperId}/`, {
      include_web_check: includeWebCheck,
    });
    return response.data;
  },

  async getReport(paperId) {
    const response = await api.get(`/plagiarism/report/${paperId}/`);
    return response.data;
  },
};

export default plagiarismService;

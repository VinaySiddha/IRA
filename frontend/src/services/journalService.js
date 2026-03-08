import api from './api';

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const journalService = {
  async getVolumes() {
    const response = await api.get('/journal/volumes/');
    return toArray(response.data);
  },

  async getVolume(id) {
    const response = await api.get(`/journal/volumes/${id}/`);
    return response.data;
  },

  async getIssues(params = {}) {
    const response = await api.get('/journal/issues/', { params });
    return toArray(response.data);
  },

  async getIssue(id) {
    const response = await api.get(`/journal/issues/${id}/`);
    return response.data;
  },

  async getArchive(params = {}) {
    const response = await api.get('/journal/archive/', { params });
    return toArray(response.data);
  },
};

export default journalService;

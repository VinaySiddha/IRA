import api from './api';

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const searchService = {
  async search(query, filters = {}) {
    const params = { q: query, ...filters };
    const response = await api.get('/search/', { params });
    return {
      results: toArray(response.data),
      count: response.data?.count || 0,
    };
  },
};

export default searchService;

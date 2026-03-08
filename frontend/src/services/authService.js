import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('ira_token', token);
    localStorage.setItem('ira_user', JSON.stringify(user));
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    const { token, user } = response.data;
    localStorage.setItem('ira_token', token);
    localStorage.setItem('ira_user', JSON.stringify(user));
    return response.data;
  },

  logout() {
    localStorage.removeItem('ira_token');
    localStorage.removeItem('ira_user');
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  getStoredUser() {
    const user = localStorage.getItem('ira_user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('ira_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('ira_token');
  },
};

export default authService;

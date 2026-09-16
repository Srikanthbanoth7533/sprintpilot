import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('sprintpilot_token', res.data.token);
      localStorage.setItem('sprintpilot_user', JSON.stringify({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('sprintpilot_token');
    localStorage.removeItem('sprintpilot_user');
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getStoredUser: () => {
    try {
      const stored = localStorage.getItem('sprintpilot_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('sprintpilot_token');
  }
};

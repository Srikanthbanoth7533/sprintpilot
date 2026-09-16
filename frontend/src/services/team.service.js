import api from './api';

export const teamService = {
  getTeams: async () => {
    const res = await api.get('/teams');
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  }
};

import api from './api';

export const sprintService = {
  getSprintsByProduct: async (productId) => {
    const res = await api.get(`/sprints/product/${productId}`);
    return res.data;
  },

  getSprintById: async (id) => {
    const res = await api.get(`/sprints/${id}`);
    return res.data;
  },

  getActiveSprint: async (productId) => {
    const res = await api.get(`/sprints/product/${productId}/active`);
    return res.data || null;
  },

  createSprint: async (sprintData) => {
    const res = await api.post('/sprints', sprintData);
    return res.data;
  },

  startSprint: async (id) => {
    const res = await api.put(`/sprints/${id}/start`);
    return res.data;
  },

  completeSprint: async (id) => {
    const res = await api.put(`/sprints/${id}/complete`);
    return res.data;
  },

  deleteSprint: async (id) => {
    await api.delete(`/sprints/${id}`);
  }
};

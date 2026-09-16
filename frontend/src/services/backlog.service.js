import api from './api';

export const backlogService = {
  getBacklogByProduct: async (productId) => {
    const res = await api.get(`/stories/product/${productId}`);
    return res.data;
  },

  getStoriesBySprint: async (sprintId) => {
    const res = await api.get(`/stories/sprint/${sprintId}`);
    return res.data;
  },

  getStoryById: async (id) => {
    const res = await api.get(`/stories/${id}`);
    return res.data;
  },

  createStory: async (storyData) => {
    const res = await api.post('/stories', storyData);
    return res.data;
  },

  updateStory: async (id, storyData) => {
    const res = await api.put(`/stories/${id}`, storyData);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.put(`/stories/${id}/status`, { status });
    return res.data;
  },

  updatePrioritization: async (id, factors) => {
    const res = await api.put(`/stories/${id}/prioritize`, factors);
    return res.data;
  },

  assignSprint: async (id, sprintId) => {
    const res = await api.put(`/stories/${id}/assign-sprint/${sprintId}`);
    return res.data;
  },

  removeFromSprint: async (id) => {
    const res = await api.put(`/stories/${id}/remove-sprint`);
    return res.data;
  },

  deleteStory: async (id) => {
    await api.delete(`/stories/${id}`);
  }
};

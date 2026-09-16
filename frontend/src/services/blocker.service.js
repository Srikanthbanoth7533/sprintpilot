import api from './api';

export const blockerService = {
  getActiveBlockers: async () => {
    const res = await api.get('/blockers/active');
    return res.data;
  },

  getBlockersByStory: async (storyId) => {
    const res = await api.get(`/blockers/story/${storyId}`);
    return res.data;
  },

  createBlocker: async (storyId, reason) => {
    const res = await api.post('/blockers', { storyId, reason });
    return res.data;
  },

  resolveBlocker: async (id) => {
    const res = await api.put(`/blockers/${id}/resolve`);
    return res.data;
  }
};

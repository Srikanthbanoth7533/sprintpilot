import api from './api';

export const releaseService = {
  getReleasesByProduct: async (productId) => {
    const res = await api.get(`/releases/product/${productId}`);
    return res.data;
  },

  createRelease: async (releaseData) => {
    const res = await api.post('/releases', releaseData);
    return res.data;
  },

  updateRelease: async (id, releaseData) => {
    const res = await api.put(`/releases/${id}`, releaseData);
    return res.data;
  },

  deleteRelease: async (id) => {
    await api.delete(`/releases/${id}`);
  }
};

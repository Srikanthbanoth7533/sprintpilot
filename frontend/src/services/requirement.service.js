import api from './api';

export const requirementService = {
  getRequirementsByProduct: async (productId) => {
    const res = await api.get(`/requirements/product/${productId}`);
    return res.data;
  },

  createRequirement: async (reqData) => {
    const res = await api.post('/requirements', reqData);
    return res.data;
  },

  updateRequirement: async (id, reqData) => {
    const res = await api.put(`/requirements/${id}`, reqData);
    return res.data;
  },

  deleteRequirement: async (id) => {
    await api.delete(`/requirements/${id}`);
  }
};

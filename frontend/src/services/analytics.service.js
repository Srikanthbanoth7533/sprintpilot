import api from './api';

export const analyticsService = {
  getDashboardMetrics: async (productId = null) => {
    const params = productId ? { productId } : {};
    const res = await api.get('/analytics/dashboard', { params });
    return res.data;
  }
};

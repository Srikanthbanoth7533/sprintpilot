import api from './api';

export const aiService = {
  generateStory: async (prompt, productId = null) => {
    const res = await api.post('/ai/generate-story', { prompt, productId });
    return res.data;
  }
};

import apiClient from './apiClient';

const tutorService = {
  askDoubt: async (history) => {
    try {
      const response = await apiClient.post('/tutor/ask', { history });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to connect to AdaptiveAI Tutor. Please try again.');
    }
  }
};

export default tutorService;

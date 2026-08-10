import apiClient from './apiClient';

const proctoringService = {
  logViolation: async (violationData) => {
    const response = await apiClient.post('/proctoring/multiple-person', violationData);
    return response.data;
  },

  getIntegrityScore: async (examId) => {
    const response = await apiClient.get(`/proctoring/integrity/${examId}`);
    return response.data;
  },

  getViolations: async (examId) => {
    const response = await apiClient.get(`/proctoring/multiple-person/${examId}`);
    return response.data;
  },

  logHeadDirectionViolation: async (data) => {
    try {
      const response = await apiClient.post('/proctoring/head-direction', data);
      return response.data;
    } catch (error) {
      console.error('Error logging head direction violation:', error);
      throw error;
    }
  }
};

export default proctoringService;

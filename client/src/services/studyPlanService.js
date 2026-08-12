import api from './apiClient';

export const studyPlanService = {
  getTodayPlan: async () => {
    const response = await api.get('/study-plan/today');
    return response.data;
  },

  startTask: async (planId, taskId) => {
    const response = await api.post(`/study-plan/${planId}/tasks/${taskId}/start`);
    return response.data;
  },

  completeTask: async (planId, taskId) => {
    const response = await api.post(`/study-plan/${planId}/tasks/${taskId}/complete`);
    return response.data;
  }
};

import apiClient from './apiClient';

export const settingsService = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data.data;
  },

  updateSettings: async (settingsData) => {
    const response = await apiClient.patch('/settings', settingsData);
    return response.data.data;
  },
};

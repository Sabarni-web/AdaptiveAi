import apiClient from './apiClient';

export const profileService = {
  getIntelligenceProfile: async () => {
    const response = await apiClient.get('/users/me/intelligence-profile');
    return response.data.data;
  },
  
  updateProfile: async (data) => {
    const response = await apiClient.put('/users/me/profile', data);
    return response.data.user;
  }
};

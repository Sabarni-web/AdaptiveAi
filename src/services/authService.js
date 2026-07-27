import apiClient from './apiClient';

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Backend unavailable, returning mock login data.');
        const role = email.includes('teacher')
          ? 'teacher'
          : email.includes('admin')
          ? 'admin'
          : 'student';
        return {
          user: {
            id: 'mock-user-id',
            name: email.split('@')[0].toUpperCase(),
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          },
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        };
      }
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Backend unavailable, returning mock registration.');
        return { success: true, message: 'Mock registration complete!' };
      }
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        return { success: true, message: 'Mock reset email sent!' };
      }
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        return { success: true, message: 'Mock password reset complete!' };
      }
      throw error;
    }
  },
};

export default authService;

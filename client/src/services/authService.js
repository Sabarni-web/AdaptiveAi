import apiClient from './apiClient';

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;
      return {
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
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
  googleLogin: async (accessToken) => {
    try {
      const response = await apiClient.post('/auth/google', { accessToken });
      const { user, tokens } = response.data.data;
      return {
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
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
      if (import.meta.env.DEV && !error.response) {
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
      if (import.meta.env.DEV && !error.response) {
        return { success: true, message: 'Mock password reset complete!' };
      }
      throw error;
    }
  },
};

export default authService;

import axios from 'axios';

class ViolationLogger {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/v1/proctoring',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add interceptor for auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async logFaceViolation(examId, event, duration, confidence) {
    try {
      const response = await this.api.post('/face-log', {
        examId,
        event,
        duration,
        confidence
      });
      return response.data;
    } catch (error) {
      console.error('Failed to log violation via API:', error);
      throw error;
    }
  }
}

export const violationLogger = new ViolationLogger();

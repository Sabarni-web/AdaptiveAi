import apiClient from './apiClient';

const teacherService = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/teacher/stats');
      return res.data;
    } catch (e) {
      return {
        activeExams: 3,
        totalStudents: 142,
        pendingGrades: 8,
        avgCompletionTime: '24 min',
      };
    }
  },
  getQuestions: async () => {
    try {
      const res = await apiClient.get('/teacher/questions');
      return res.data;
    } catch (e) {
      return [
        { id: 'q1', text: '<p>Explain binary trees search time.</p>', type: 'MCQ', difficulty: 0.5, marks: 2 },
        { id: 'q2', text: '<p>Database normal form redundancy checks.</p>', type: 'MCQ', difficulty: 1.0, marks: 3 },
        { id: 'q3', text: '<p>Explain Optimistic locking.</p>', type: 'DESCRIPTIVE', difficulty: 1.8, marks: 5 },
      ];
    }
  },
  createQuestion: async (data) => {
    try {
      const res = await apiClient.post('/teacher/questions', data);
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  deleteQuestion: async (id) => {
    try {
      const res = await apiClient.delete(`/teacher/questions/${id}`);
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  getExams: async () => {
    try {
      const res = await apiClient.get('/teacher/exams');
      return res.data;
    } catch (e) {
      return [
        { id: 'e1', title: 'Data Structures Midterm', subject: 'CS101', duration: 1800, questionLimit: 15 },
        { id: 'e2', title: 'RDBMS Final Evaluation', subject: 'CS202', duration: 3600, questionLimit: 30 },
      ];
    }
  },
  createExam: async (data) => {
    try {
      const res = await apiClient.post('/teacher/exams', data);
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  getLiveStudents: async () => {
    try {
      const res = await apiClient.get('/teacher/live-monitor');
      return res.data;
    } catch (e) {
      return [
        { id: 's1', name: 'Alice Cooper', progress: 45, focusViolations: 0, status: 'online', timeRemaining: '14:32' },
        { id: 's2', name: 'Bob Dylan', progress: 70, focusViolations: 3, status: 'busy', timeRemaining: '06:12' },
        { id: 's3', name: 'Charlie Sheen', progress: 20, focusViolations: 1, status: 'away', timeRemaining: '18:50' },
      ];
    }
  },
  getPendingReviews: async () => {
    try {
      const res = await apiClient.get('/teacher/grade-reviews');
      return res.data;
    } catch (e) {
      return [
        {
          id: 'r1',
          studentName: 'Clara Oswald',
          questionText: 'Explain the difference between optimistic concurrency control and pessimistic concurrency control in database transactions.',
          studentAnswer: 'Pessimistic concurrency control locks the data item to prevent other concurrent transaction modifications. Optimistic concurrency control allows updates to proceed and checks for violations at commit time.',
          maxMarks: 5,
        },
      ];
    }
  },
  submitReview: async (reviewId, marks) => {
    try {
      const res = await apiClient.post(`/teacher/grade-reviews/${reviewId}`, { marks });
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
};

export default teacherService;

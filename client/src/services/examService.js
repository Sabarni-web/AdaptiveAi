import apiClient from './apiClient';

// Local Simulation Database for stand-alone testing in Dev mode
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    type: 'MCQ',
    text: '<p>What is the time complexity of searching in a balanced Binary Search Tree (BST)?</p>',
    options: [
      { label: 'A', text: 'O(1)' },
      { label: 'B', text: 'O(log n)' },
      { label: 'C', text: 'O(n)' },
      { label: 'D', text: 'O(n log n)' },
    ],
    translations: {
      hi: {
        text: '<p>संतुलित बाइनरी सर्च ट्री (BST) में खोजने की समय जटिलता (time complexity) क्या है?</p>',
        options: [
          { label: 'A', text: 'O(1)' },
          { label: 'B', text: 'O(log n)' },
          { label: 'C', text: 'O(n)' },
          { label: 'D', text: 'O(n log n)' },
        ]
      },
      bn: {
        text: '<p>একটি ব্যালান্সড বাইনারি সার্চ ট্রি (BST)-তে খোঁজার সময় জটিলতা (time complexity) কত?</p>',
        options: [
          { label: 'A', text: 'O(1)' },
          { label: 'B', text: 'O(log n)' },
          { label: 'C', text: 'O(n)' },
          { label: 'D', text: 'O(n log n)' },
        ]
      }
    },
    correctOption: 'B',
    difficulty: 0.5,
    marks: 2,
    explanation: 'A balanced BST divides the search space in half at each step, resulting in a logarithmic time complexity.',
  },
  {
    id: 'q2',
    type: 'MCQ',
    text: '<p>Which of the following database normal forms eliminates transitive dependencies?</p>',
    options: [
      { label: 'A', text: '1NF' },
      { label: 'B', text: '2NF' },
      { label: 'C', text: '3NF' },
      { label: 'D', text: 'BCNF' },
    ],
    correctOption: 'C',
    difficulty: 1.0,
    marks: 3,
    explanation: '3NF requires that no non-prime attribute is transitively dependent on any superkey.',
  },
  {
    id: 'q3',
    type: 'DESCRIPTIVE',
    text: '<p>Explain the difference between optimistic concurrency control and pessimistic concurrency control in database transactions.</p>',
    difficulty: 1.8,
    marks: 5,
    modelAnswer: 'Pessimistic concurrency control locks data items to prevent conflict. Optimistic concurrency control allows transactions to proceed without locks and checks for conflicts at commit time.',
  },
  {
    id: 'q4',
    type: 'MCQ',
    text: '<p>In React, what is the main purpose of the <code>useEffect</code> hook?</p>',
    options: [
      { label: 'A', text: 'To update the state directly' },
      { label: 'B', text: 'To handle side effects in functional components' },
      { label: 'C', text: 'To perform heavy mathematical calculations' },
      { label: 'D', text: 'To memoize expensive child components' },
    ],
    correctOption: 'B',
    difficulty: 0.2,
    marks: 2,
    explanation: 'useEffect is designed to perform operations like API requests, subscriptions, or manual DOM manipulations.',
  },
  {
    id: 'q5',
    type: 'MCQ',
    text: '<p>Which protocol is primarily used to transmit real-time bidrectional message packets over a TCP socket?</p>',
    options: [
      { label: 'A', text: 'HTTP/1.1' },
      { label: 'B', text: 'WebSocket' },
      { label: 'C', text: 'SMTP' },
      { label: 'D', text: 'FTP' },
    ],
    correctOption: 'B',
    difficulty: 0.8,
    marks: 2,
    explanation: 'WebSocket offers full-duplex persistent connection over a single TCP connection.',
  },
];

let sessionState = {
  sessionId: null,
  currentQuestionIndex: 0,
  ability: 0.0,
  history: [],
  answers: {},
  isFinished: false,
  language: 'en',
};

const examService = {
  startExam: async (payload, language = 'en') => {
    try {
      const response = await apiClient.post('/exams/start', { ...payload, language });
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        console.warn('Backend offline. Initiating mock exam session.');
        sessionState = {
          sessionId: `mock-session-${Date.now()}`,
          currentQuestionIndex: 0,
          ability: 0.0,
          history: [],
          answers: {},
          isFinished: false,
          language: language,
        };
        return {
          sessionId: sessionState.sessionId,
          status: 'estimating',
          config: {
            title: 'Full Stack Engineering Evaluation',
            durationSeconds: 1800,
            questionLimit: 10,
          },
        };
      }
      throw error;
    }
  },

  getNextQuestion: async (sessionId) => {
    try {
      const response = await apiClient.get(`/exams/${sessionId}/next-question`);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        if (sessionState.currentQuestionIndex >= 10) {
          sessionState.isFinished = true;
          return { isStop: true };
        }
        const mockIndex = sessionState.currentQuestionIndex % MOCK_QUESTIONS.length;
        const question = MOCK_QUESTIONS[mockIndex];
        let displayQuestionText = question.text;
        let displayOptions = question.options;

        if (sessionState.language !== 'en' && question.translations && question.translations[sessionState.language]) {
          const translation = question.translations[sessionState.language];
          displayQuestionText = translation.text || displayQuestionText;
          displayOptions = translation.options || displayOptions;
        }

        return {
          question: {
            id: question.id + '-' + sessionState.currentQuestionIndex,
            type: question.type,
            text: displayQuestionText,
            options: displayOptions,
            marks: question.marks,
            questionNumber: sessionState.currentQuestionIndex + 1,
            totalQuestions: 10,
          },
          index: sessionState.currentQuestionIndex,
          status: 'adaptive',
          isStop: false,
        };
      }
      throw error;
    }
  },

  submitAnswer: async (sessionId, { questionId, answer, timeSpent }) => {
    try {
      const response = await apiClient.post(`/exams/${sessionId}/answer`, {
        questionId,
        answer,
        timeSpent,
      });
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        const baseQuestionId = questionId.split('-')[0];
        const question = MOCK_QUESTIONS.find((q) => q.id === baseQuestionId);
        let isCorrect = false;
        if (question?.type === 'MCQ') {
          isCorrect = answer === question.correctOption;
        } else {
          isCorrect = answer.length > 30; // descriptive simple check
        }

        // Adjust theta ability score
        const oldAbility = sessionState.ability;
        sessionState.ability = isCorrect ? oldAbility + 0.5 : oldAbility - 0.4;
        sessionState.answers[questionId] = answer;
        sessionState.history.push({
          questionIndex: sessionState.currentQuestionIndex,
          ability: sessionState.ability,
          timestamp: new Date().toISOString(),
        });

        sessionState.currentQuestionIndex += 1;

        return {
          ability: sessionState.ability,
          success: true,
          isCorrect,
          correctAnswer: question?.correctOption || question?.modelAnswer || 'Correct Answer Unavailable',
          explanation: question?.explanation || 'No explanation provided in mock data.',
          marksAwarded: isCorrect ? question?.marks : 0,
        };
      }
      throw error;
    }
  },

  getExamStatus: async (sessionId) => {
    try {
      const response = await apiClient.get(`/exams/${sessionId}/status`);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        return {
          sessionId,
          status: sessionState.isFinished ? 'completed' : 'adaptive',
          currentQuestionIndex: sessionState.currentQuestionIndex,
        };
      }
      throw error;
    }
  },

  submitExam: async (sessionId) => {
    try {
      const response = await apiClient.post(`/exams/${sessionId}/submit`);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        sessionState.isFinished = true;
        return { success: true };
      }
      throw error;
    }
  },

  getResult: async (sessionId) => {
    try {
      const response = await apiClient.get(`/exams/${sessionId}/result`);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        return {
          score: { total: 8, max: 14, percentage: 57 },
          grade: 'B',
          percentile: 82,
          ability: sessionState.ability,
          confidenceInterval: [sessionState.ability - 0.15, sessionState.ability + 0.15],
          examTitle: 'Full Stack Engineering Evaluation',
          completedAt: new Date().toISOString(),
          sections: [
            { name: 'Data Structures & Algorithms', score: 2, max: 2, percentage: 100, color: 'bg-green-500' },
            { name: 'Database Management Systems', score: 3, max: 3, percentage: 100, color: 'bg-green-500' },
            { name: 'System Design & Concepts', score: 3, max: 9, percentage: 33, color: 'bg-red-500' },
          ],
          history: sessionState.history.length > 0 ? sessionState.history : [
            { questionIndex: 1, ability: -0.4, timestamp: new Date() },
            { questionIndex: 2, ability: 0.1, timestamp: new Date() },
            { questionIndex: 3, ability: 0.6, timestamp: new Date() },
            { questionIndex: 4, ability: 1.2, timestamp: new Date() },
          ],
          topics: [
            { name: 'Binary Search Trees', score: 2, max: 2, percentage: 100, questionsAttempted: 1 },
            { name: 'Database Normalization', score: 3, max: 3, percentage: 100, questionsAttempted: 1 },
            { name: 'Optimistic & Pessimistic Locks', score: 3, max: 5, percentage: 60, questionsAttempted: 1 },
            { name: 'WebSockets & HTTP', score: 0, max: 2, percentage: 0, questionsAttempted: 1 },
          ],
          recommendations: [
            {
              topic: 'WebSockets & HTTP',
              priority: 'high',
              resources: [
                { title: 'WebSockets Crash Course - Video', type: 'video', url: 'https://youtube.com' },
                { title: 'Designing Event-Driven Communication APIs', type: 'article', url: 'https://medium.com' },
              ],
            },
            {
              topic: 'Concurrency Control in Databases',
              priority: 'medium',
              resources: [
                { title: 'Database Locking Strategies Explained', type: 'article', url: 'https://wikipedia.org' },
              ],
            },
          ],
          answers: MOCK_QUESTIONS.map((q) => ({
            question: q,
            studentAnswer: sessionState.answers[q.id] || 'B',
            correctAnswer: q.correctOption || 'Descriptive Response Evaluated',
            isCorrect: q.correctOption ? (sessionState.answers[q.id] === q.correctOption) : true,
            marksObtained: q.correctOption ? (sessionState.answers[q.id] === q.correctOption ? q.marks : 0) : 3,
            maxMarks: q.marks,
            aiExplanation: q.explanation || 'The answer matches the expected evaluation criteria with reasonable semantic coverage.',
          })),
        };
      }
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/exams/history');
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        return [
          {
            sessionId: 'sess-1',
            title: 'Introduction to Computer Science',
            grade: 'A',
            score: 92,
            completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            sessionId: 'sess-2',
            title: 'Advanced Database Systems',
            grade: 'B',
            score: 78,
            completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  abandonExam: async (sessionId) => {
    try {
      const response = await apiClient.post(`/exams/${sessionId}/abandon`);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        return { success: true };
      }
      throw error;
    }
  },

  getRecommendation: async () => {
    try {
      const response = await apiClient.get('/analytics/recommendations/me');
      return response.data.recommendation;
    } catch (error) {
      if (import.meta.env.DEV && !error.response) {
        return {
          type: 'WEAK_SUBJECT',
          domain: 'CSE Core',
          subject: 'Database Management Systems',
          topics: ['Normalization', 'SQL Joins', 'Transactions'],
          questionType: 'MCQ',
          difficulty: 'Medium',
          questionCount: 20,
          estimatedMinutes: 25,
          title: 'Strengthen Database Management Systems',
          description: 'AdaptiveAI identified areas where you can improve based on your recent performance.',
          reason: 'Your recent DBMS accuracy is 58%.'
        };
      }
      throw error;
    }
  },
};

export default examService;

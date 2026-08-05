const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'student@example.com',
      password: 'Password123!'
    });
    const token = res.data.data.accessToken;
    
    // We assume sessionId from the user's DB output is 6a737b60e46226481ef26f5d
    const sessionId = '6a737b60e46226481ef26f5d';
    
    console.log('Testing invalid questionId length...');
    try {
      await axios.post(`http://localhost:5000/api/v1/exams/${sessionId}/answer`, {
        questionId: 'q1-0', // less than 24 chars
        answer: 'SKIP',
        timeSpent: 30
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch(e) {
      console.log('Error 1:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
    
    console.log('Testing valid questionId length...');
    try {
      const ansRes2 = await axios.post(`http://localhost:5000/api/v1/exams/${sessionId}/answer`, {
        questionId: '6a737b66e46226481ef26f5e',
        answer: 'SKIP',
        timeSpent: 30
      }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Success 2:', ansRes2.data);
    } catch(e) {
      console.log('Error 2:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
  } catch(e) { console.error('Outer error:', e.message); }
}

run();

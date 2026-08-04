import { aiService } from './src/services/aiService';

async function run() {
  try {
    const questions = await aiService.generateQuestions('Mathematics', 'medium', 1);
    console.log('SUCCESS:', JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error('ERROR:', error);
  }
}

run();

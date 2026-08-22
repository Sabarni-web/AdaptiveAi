import { aiService } from './src/services/aiService';

async function run() {
  try {
    const result = await aiService.askTutor([
      { role: 'user', content: 'What is 2+2?' }
    ]);
    console.log("Success! Output:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();

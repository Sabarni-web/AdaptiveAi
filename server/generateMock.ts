import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { aiService } from './src/services/aiService';
import { Question } from './src/models/Question';

async function generate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/adaptiveai');
    console.log('Connected to DB');

    console.log('Calling AI to generate 2 Full Stack questions...');
    const questions = await aiService.generateQuestions('Full Stack Engineering', 'medium', 2);
    
    console.log(`Generated ${questions.length} questions. Saving to DB...`);
    await Question.insertMany(questions);
    
    console.log('Successfully saved generated questions to DB. You can now take the exam and see the native translations!');
  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

generate();

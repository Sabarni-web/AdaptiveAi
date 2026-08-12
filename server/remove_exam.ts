import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ExamConfig } from './src/models/ExamConfig';

dotenv.config();

async function removeExam() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');
    
    const result = await ExamConfig.deleteOne({ _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1') });
    console.log('Delete result:', result);
    
    // Also try to delete by title just in case it was seeded with a different ID somehow
    const resultByTitle = await ExamConfig.deleteMany({ title: 'Full Stack Engineering Evaluation' });
    console.log('Delete by title result:', resultByTitle);

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

removeExam();

import mongoose from 'mongoose';
import { Question } from '../models/Question';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fix() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to DB');

  const subjectsInfo = await Question.aggregate([
    {
      $group: {
        _id: { domain: '$domain', subject: '$subject' }
      }
    }
  ]);

  for (const info of subjectsInfo) {
    const { domain, subject } = info._id;
    const questions = await Question.find({ domain, subject }).sort({ _id: 1 });
    
    let mcqCount = 0;
    let saqCount = 0;
    let deletedCount = 0;

    for (let i = 0; i < questions.length; i++) {
      if (i < 100) {
        questions[i].questionType = 'MCQ';
        questions[i].isActive = true;
        await questions[i].save();
        mcqCount++;
      } else if (i < 150) {
        questions[i].questionType = 'SAQ';
        questions[i].isActive = true;
        await questions[i].save();
        saqCount++;
      } else {
        await Question.deleteOne({ _id: questions[i]._id });
        deletedCount++;
      }
    }
    console.log(`Updated ${subject}: ${mcqCount} MCQ, ${saqCount} SAQ, deleted ${deletedCount} extra questions.`);
  }

  console.log('All done.');
  process.exit(0);
}

fix().catch(console.error);

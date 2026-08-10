import mongoose from 'mongoose';
import { Question } from './src/models/Question';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || '');
  
  const allQs = await Question.find({});
  let malformedCount = 0;
  for (const q of allQs) {
    if (q.questionType === 'MCQ' && (!q.options || q.options.length < 2)) {
      malformedCount++;
      await Question.findByIdAndDelete(q._id);
    } else if (q.questionType === 'SAQ' && (!q.questionText || q.questionText.trim().split(' ').length < 2)) {
      // Very likely a malformed SAQ (just 1 word)
      malformedCount++;
      await Question.findByIdAndDelete(q._id);
    } else if (q.questionText && q.questionText.length < 5) {
      malformedCount++;
      await Question.findByIdAndDelete(q._id);
    }
  }
  
  console.log('Deleted malformed questions:', malformedCount);
  process.exit(0);
}

check().catch(console.error);

import mongoose from 'mongoose';
import { ExamSession } from './src/models/ExamSession';
import { Question } from './src/models/Question';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || '');
  console.log('Connected to:', process.env.MONGO_URI);
  const sessions = await ExamSession.find().sort({ createdAt: -1 }).limit(1);
  for (const session of sessions) {
    console.log('--- Session', session._id);
    for (let i = 0; i < session.questionsAsked.length; i++) {
      const qId = session.questionsAsked[i].questionId;
      const q = await Question.findById(qId);
      console.log('Q' + (i+1) + ':', q ? q.questionText : 'null', 'Type:', q ? q.questionType : 'null');
      if (q && q.options) console.log('Options:', q.options.length, q.options);
    }
  }
  process.exit(0);
}
run();

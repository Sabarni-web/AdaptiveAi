const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const db = mongoose.connection.db;
  const questionsColl = db.collection('questions');

  const subjectsInfo = await questionsColl.aggregate([
    {
      $group: {
        _id: { domain: '$domain', subject: '$subject' }
      }
    }
  ]).toArray();

  for (const info of subjectsInfo) {
    const { domain, subject } = info._id;
    const questions = await questionsColl.find({ domain, subject }).sort({ _id: 1 }).toArray();
    
    let mcqCount = 0;
    let saqCount = 0;
    let deletedCount = 0;

    for (let i = 0; i < questions.length; i++) {
      if (i < 100) {
        await questionsColl.updateOne({ _id: questions[i]._id }, { $set: { questionType: 'MCQ', isActive: true } });
        mcqCount++;
      } else if (i < 150) {
        await questionsColl.updateOne({ _id: questions[i]._id }, { $set: { questionType: 'SAQ', isActive: true } });
        saqCount++;
      } else {
        await questionsColl.deleteOne({ _id: questions[i]._id });
        deletedCount++;
      }
    }
    console.log(`Updated ${subject}: ${mcqCount} MCQ, ${saqCount} SAQ, deleted ${deletedCount} extra questions.`);
  }

  console.log('All done.');
  process.exit(0);
}

fix().catch(console.error);

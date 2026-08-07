const mongoose = require('mongoose');

async function fixSeedDifficulty() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;
  const questionsCollection = db.collection('questions');

  // Find the seeded question and make its difficulty 'easy' so the orchestrator finds it on the first fetch
  await questionsCollection.updateOne(
    { subject: 'Full Stack Engineering' },
    { $set: { difficulty: 'easy' } }
  );

  console.log('Successfully changed the seeded question difficulty to easy.');
  process.exit(0);
}

fixSeedDifficulty().catch(console.error);

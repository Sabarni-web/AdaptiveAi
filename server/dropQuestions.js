const mongoose = require('mongoose');

async function dropQuestions() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;

  const questionsCollection = db.collection('questions');
  
  // Drop all old questions that lack native translations
  await questionsCollection.deleteMany({});
  
  console.log('Successfully deleted all old English-only questions from the database.');
  process.exit(0);
}

dropQuestions().catch(console.error);

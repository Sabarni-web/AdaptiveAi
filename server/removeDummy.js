const mongoose = require('mongoose');

async function removeDummyTranslations() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;

  const questionsCollection = db.collection('questions');
  
  // This just removes the "(Hindi)" and "(Bengali)" prefixes I added
  const questions = await questionsCollection.find({}).toArray();
  for (const q of questions) {
    if (q.translations && q.translations.hi) {
      if (q.translations.hi.question.includes('(Hindi)')) {
        await questionsCollection.updateOne(
          { _id: q._id },
          { $unset: { translations: "" } }
        );
      }
    }
  }

  console.log('Removed dummy translations.');
  process.exit(0);
}

removeDummyTranslations().catch(console.error);

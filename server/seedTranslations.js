const mongoose = require('mongoose');

async function updateQuestions() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;

  const questionsCollection = db.collection('questions');
  const questions = await questionsCollection.find({}).toArray();

  for (const q of questions) {
    if (!q.translations || !q.translations.hi) {
      await questionsCollection.updateOne(
        { _id: q._id },
        {
          $set: {
            "translations.hi": {
              question: `<p>(Hindi) ${q.question.replace(/<[^>]+>/g, '')}</p>`,
              options: q.options.map(o => ({ label: o.label, text: `(हिन्दी) ${o.text}` }))
            },
            "translations.bn": {
              question: `<p>(Bengali) ${q.question.replace(/<[^>]+>/g, '')}</p>`,
              options: q.options.map(o => ({ label: o.label, text: `(বাংলা) ${o.text}` }))
            }
          }
        }
      );
    }
  }

  console.log('Successfully updated questions with dummy translations.');
  process.exit(0);
}

updateQuestions().catch(console.error);

const mongoose = require('mongoose');
require('dotenv').config({path: require('path').join(__dirname, '../../.env')});

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const sessions = await db.collection('examsessions').find({ subject: { $exists: false } }).toArray();
  console.log('Without subject:', sessions.length);
  const sample = await db.collection('examsessions').find().limit(2).toArray();
  console.log('Sample:', sample.map(x => ({id: x._id, sub: x.subject})));
  
  const allSessions = await db.collection('examsessions').find().toArray();
  const nullSubjects = allSessions.filter(s => !s.subject);
  console.log('Falsy subjects:', nullSubjects.length);
  process.exit(0);
});

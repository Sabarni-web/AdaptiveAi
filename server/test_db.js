const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://mukherjeesabarni60_db_user:3hlxb6HYkzOaX4YE@ac-xr2yvnb-shard-00-00.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-01.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-02.q9yysxj.mongodb.net:27017/adaptiveai?ssl=true&replicaSet=atlas-y915rj-shard-0&authSource=admin&retryWrites=true&w=majority');
  const db = mongoose.connection.useDb('adaptiveai');
  const sessions = await db.collection('examsessions').find({}).toArray();
  console.log('Total sessions:', sessions.length);
  if (sessions.length > 0) {
    console.log('Last session:', JSON.stringify(sessions[sessions.length - 1], null, 2));
  }
  process.exit(0);
}

run();

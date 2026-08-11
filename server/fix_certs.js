const mongoose = require('mongoose');

const uri = "mongodb://mukherjeesabarni60_db_user:3hlxb6HYkzOaX4YE@ac-xr2yvnb-shard-00-00.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-01.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-02.q9yysxj.mongodb.net:27017/adaptiveai?ssl=true&replicaSet=atlas-y915rj-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    const certs = db.collection('certificates');
    const result = await certs.updateMany(
      { examName: { $regex: /^undefined/i } },
      { $set: { 
          examName: 'Full Stack Engineering Evaluation',
          subject: 'Full Stack Engineering' 
      } }
    );
    console.log(`Updated ${result.modifiedCount} certificates.`);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));

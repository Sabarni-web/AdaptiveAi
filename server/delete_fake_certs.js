const mongoose = require('mongoose');

const uri = "mongodb://mukherjeesabarni60_db_user:3hlxb6HYkzOaX4YE@ac-xr2yvnb-shard-00-00.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-01.q9yysxj.mongodb.net:27017,ac-xr2yvnb-shard-00-02.q9yysxj.mongodb.net:27017/adaptiveai?ssl=true&replicaSet=atlas-y915rj-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    const certs = db.collection('certificates');
    
    // We want to delete the two fake certificates we just renamed.
    // The original one has certificateId ending in 000001 (issued 8/6/2026)
    // The fake ones end in 000002 and 000003 (issued 8/10/2026).
    // Let's delete certificates that were issued on 8/10/2026 (or just by certificateId).
    
    const result = await certs.deleteMany({
      certificateId: { $in: ['AAI-2026-000002', 'AAI-2026-000003'] }
    });
    
    console.log(`Deleted ${result.deletedCount} certificates.`);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));

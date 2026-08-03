import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function updatePasswords() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.useDb('adaptiveai');
  const hash = await bcrypt.hash('password', 10);
  await db.collection('users').updateMany({ email: /mukherjee/ }, { $set: { password: hash } });
  console.log('Updated passwords successfully for all mukherjee users');
  await mongoose.disconnect();
}

updatePasswords();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function updatePasswords() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.useDb('adaptiveai');
  const hash = await bcrypt.hash('password', 10);
  await db.collection('users').updateOne({ email: 'student@adaptiveai.com' }, { $set: { password: hash } });
  await db.collection('users').updateOne({ email: 'instructor@adaptiveai.com' }, { $set: { password: hash } });
  console.log('Updated passwords successfully');
  await mongoose.disconnect();
}

updatePasswords();

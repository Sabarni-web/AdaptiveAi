import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';
import { seedDatabase } from '../seed';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`database successfully connected (MongoDB Host: ${conn.connection.host})`);
    await seedDatabase();
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

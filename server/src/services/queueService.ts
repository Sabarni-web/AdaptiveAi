import { Queue } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const descriptiveGradeQueue = new Queue('gradeDescriptive', {
  connection: {
    host: new URL(env.REDIS_URI).hostname,
    port: parseInt(new URL(env.REDIS_URI).port) || 6379,
  }
});

export const notificationQueue = new Queue('sendNotification', {
  connection: {
    host: new URL(env.REDIS_URI).hostname,
    port: parseInt(new URL(env.REDIS_URI).port) || 6379,
  }
});

export const queueService = {
  async addGradeDescriptiveJob(answerId: string) {
    logger.info(`Queueing grading job for answer: ${answerId}`);
    await descriptiveGradeQueue.add('grade', { answerId }, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  },
  
  async addNotificationJob(userId: string, message: string) {
    logger.info(`Queueing notification job for user: ${userId}`);
    await notificationQueue.add('notify', { userId, message }, { attempts: 3 });
  }
};

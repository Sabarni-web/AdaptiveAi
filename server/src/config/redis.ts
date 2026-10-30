import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { env } from './env';
import { logger } from '../utils/logger';

const isDev = env.NODE_ENV === 'development';
const isUpstashConfigured = env.REDIS_URI && !env.REDIS_URI.includes('helpful-deer-73873.upstash.io');

export const redis = (isDev || !isUpstashConfigured)
  ? (new RedisMock() as any as Redis)
  : new Redis(env.REDIS_URI, {
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      retryStrategy: (times) => {
        if (times > 5) {
          logger.warn('Redis connection retry limit reached. Falling back to local mock.');
          return null; // Stop retrying endlessly
        }
        return Math.min(times * 1000, 5000);
      },
    });

redis.on('connect', () => {
  logger.info('Redis Connected');
});

redis.on('error', (err: any) => {
  if (err?.code === 'ENOTFOUND') {
    logger.warn(`Redis host not reachable (${err.hostname || 'remote'}). Ensure REDIS_URI in .env is valid or use RedisMock.`);
  } else {
    logger.error('Redis Error:', err);
  }
});

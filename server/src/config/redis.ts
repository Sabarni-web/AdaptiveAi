import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { env } from './env';
import { logger } from '../utils/logger';

const isDev = env.NODE_ENV === 'development';

export const redis = isDev 
  ? new RedisMock() as any as Redis 
  : new Redis(env.REDIS_URI, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        const delay = Math.min(times * 1000, 10000);
        return delay;
      },
    });

redis.on('connect', () => {
  logger.info('Redis Connected');
});

redis.on('error', (err) => {
  logger.error('Redis Error:', err);
});

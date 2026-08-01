import { Redis } from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/index.js';

export const redisConnection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => {
  logger.info('✅ Redis connecting...');
});

redisConnection.on('ready', () => {
  logger.info(`✅ Redis ready at ${config.redis.host}:${config.redis.port}`);
});

redisConnection.on('error', (err) => {
  logger.error({ error: err.message }, '❌ Redis connection error');
});

export async function checkRedisHealth(): Promise<boolean> {
  try {
    const ping = await redisConnection.ping();
    return ping === 'PONG';
  } catch (error) {
    logger.error({ error }, '❌ Redis health check failed');
    return false;
  }
}

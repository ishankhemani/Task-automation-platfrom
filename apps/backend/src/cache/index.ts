// Redis cache abstraction layer
import { Redis } from 'ioredis';
import { redisConnection } from '../queues/redis.js';
import { logger } from '../utils/index.js';

export class CacheService {
  private static redis: Redis = redisConnection;

  /**
   * Get a cached value by key
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error({ key, error }, 'Cache GET error');
      return null;
    }
  }

  /**
   * Set a cached value with optional TTL in seconds
   */
  static async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      logger.error({ key, error }, 'Cache SET error');
    }
  }

  /**
   * Delete a cached value by key
   */
  static async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error({ key, error }, 'Cache DELETE error');
    }
  }

  /**
   * Delete all keys matching a pattern (e.g., 'user:*')
   */
  static async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.debug({ pattern, count: keys.length }, 'Cache keys invalidated');
      }
    } catch (error) {
      logger.error({ pattern, error }, 'Cache INVALIDATE error');
    }
  }

  /**
   * Check if a key exists in cache
   */
  static async exists(key: string): Promise<boolean> {
    try {
      return (await this.redis.exists(key)) === 1;
    } catch (error) {
      logger.error({ key, error }, 'Cache EXISTS error');
      return false;
    }
  }

  /**
   * Set hash field
   */
  static async hset(key: string, field: string, value: unknown): Promise<void> {
    try {
      await this.redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      logger.error({ key, field, error }, 'Cache HSET error');
    }
  }

  /**
   * Get hash field
   */
  static async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error({ key, field, error }, 'Cache HGET error');
      return null;
    }
  }

  /**
   * Increment a counter
   */
  static async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logger.error({ key, error }, 'Cache INCR error');
      return 0;
    }
  }

  /**
   * Set expiry on a key
   */
  static async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.expire(key, ttlSeconds);
    } catch (error) {
      logger.error({ key, error }, 'Cache EXPIRE error');
    }
  }
}

export default CacheService;

// Test setup and global mocks
import { vi } from 'vitest';

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db?schema=public';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-12345';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-12345';
process.env.JWT_SECRET = 'test-jwt-secret-key-12345';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.CORS_ORIGIN = 'http://localhost:5173';

// Mock Prisma Client
vi.mock('../services/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
  },
  connectPrisma: vi.fn().mockResolvedValue(true),
  disconnectPrisma: vi.fn(),
}));

// Mock Redis
vi.mock('../queues/redis.js', () => ({
  redisConnection: {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn().mockResolvedValue([]),
    exists: vi.fn(),
    ping: vi.fn().mockResolvedValue('PONG'),
    on: vi.fn(),
    hset: vi.fn(),
    hget: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
  },
  checkRedisHealth: vi.fn().mockResolvedValue(true),
}));

// Mock Logger (suppress output in tests)
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
  },
}));

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/index.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectPrisma(): Promise<boolean> {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected via Prisma');
    return true;
  } catch (error) {
    logger.error({ error }, '❌ Failed to connect to PostgreSQL via Prisma');
    return false;
  }
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  logger.info('🔌 PostgreSQL connection disconnected');
}

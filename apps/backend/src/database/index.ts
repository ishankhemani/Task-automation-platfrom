// Database connection module
import { connectPrisma, disconnectPrisma, prisma } from '../services/prisma.js';
import { logger } from '../utils/index.js';

export async function connectDB(): Promise<void> {
  const connected = await connectPrisma();
  if (!connected) {
    logger.error('Failed to connect to database');
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await disconnectPrisma();
}

export { prisma };

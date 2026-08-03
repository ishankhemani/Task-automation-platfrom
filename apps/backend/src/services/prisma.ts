import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/index.js';
import { execSync } from 'child_process';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectPrisma(): Promise<boolean> {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected via Prisma');

    // Run migration check in background without blocking server startup / healthchecks
    setImmediate(() => {
      try {
        const schemaPath = process.cwd().endsWith('backend')
          ? 'prisma/schema.prisma'
          : 'apps/backend/prisma/schema.prisma';
        execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
          cwd: process.cwd(),
          stdio: 'ignore',
          env: process.env,
        });
        logger.info('✅ Database migrations verified successfully');
      } catch (migErr: any) {
        logger.warn({ error: migErr?.message || String(migErr) }, '⚠️ Auto-migration check completed or skipped');
      }
    });

    await ensureDefaultSystemAccounts();
    return true;
  } catch (error: any) {
    logger.error(
      {
        message: error?.message || String(error),
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
        cause: error?.cause,
        meta: error?.meta,
      },
      '❌ Failed to connect to PostgreSQL via Prisma'
    );
    return false;
  }
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  logger.info('🔌 PostgreSQL connection disconnected');
}

async function ensureDefaultSystemAccounts(): Promise<void> {
  try {
    const bcrypt = await import('bcryptjs');
    const adminPassword = await bcrypt.default.hash('Admin123!', 10);
    const userPassword = await bcrypt.default.hash('User123!', 10);

    const defaultAccounts = [
      {
        email: 'admin@taskplatform.com',
        name: 'Platform Admin',
        password: adminPassword,
        role: 'ADMIN' as const,
      },
      {
        email: 'admin@platform.com',
        name: 'Platform Admin',
        password: adminPassword,
        role: 'ADMIN' as const,
      },
      {
        email: 'user@taskplatform.com',
        name: 'Demo User',
        password: userPassword,
        role: 'USER' as const,
      },
      {
        email: 'user@platform.com',
        name: 'Demo User',
        password: userPassword,
        role: 'USER' as const,
      },
    ];

    for (const acc of defaultAccounts) {
      await prisma.user.upsert({
        where: { email: acc.email },
        update: {},
        create: {
          name: acc.name,
          email: acc.email,
          password: acc.password,
          role: acc.role,
          isVerified: true,
          status: 'ACTIVE',
        },
      });
    }
    logger.info('🔑 Default system accounts (Admin/User) verified in database');
  } catch (err: any) {
    logger.warn({ error: err?.message || String(err) }, '⚠️ Default system account check warning');
  }
}

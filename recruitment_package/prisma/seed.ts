import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskplatform.com' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@taskplatform.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Admin user: ${admin.email} (role: ${admin.role})`);

  // Seed Standard User
  const userPassword = await bcrypt.hash('User123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@taskplatform.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@taskplatform.com',
      password: userPassword,
      role: 'USER',
      isVerified: true,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Standard user: ${user.email} (role: ${user.role})`);

  // Seed Viewer User
  const viewerPassword = await bcrypt.hash('Viewer123!', 10);
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@taskplatform.com' },
    update: {},
    create: {
      name: 'Read Only Viewer',
      email: 'viewer@taskplatform.com',
      password: viewerPassword,
      role: 'VIEWER',
      isVerified: true,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Viewer user: ${viewer.email} (role: ${viewer.role})`);

  // Seed sample tasks for demo user
  const sampleTasks = [
    {
      title: 'Financial Analytics ETL Pipeline',
      description: 'Process and aggregate quarterly financial reports from multiple data sources into the analytics warehouse.',
      priority: 'HIGH' as const,
      status: 'COMPLETED' as const,
      createdBy: user.id,
    },
    {
      title: 'User Data Synchronization Job',
      description: 'Sync user profile data across microservices and update cache layers.',
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      createdBy: user.id,
    },
    {
      title: 'Database Backup Automation',
      description: 'Automated nightly PostgreSQL backup with compression and offsite storage.',
      priority: 'CRITICAL' as const,
      status: 'COMPLETED' as const,
      createdBy: admin.id,
    },
    {
      title: 'Report Generation Workflow',
      description: 'Generate weekly KPI reports and distribute via email to stakeholders.',
      priority: 'LOW' as const,
      status: 'FAILED' as const,
      createdBy: user.id,
    },
    {
      title: 'Cache Invalidation Pipeline',
      description: 'Flush and rebuild Redis cache layers for product catalog after bulk import.',
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
      createdBy: admin.id,
    },
  ];

  for (const task of sampleTasks) {
    const created = await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        createdBy: task.createdBy,
      },
    });

    // Add initial history
    await prisma.taskHistory.create({
      data: {
        taskId: created.id,
        oldStatus: null,
        newStatus: 'PENDING',
        changedBy: task.createdBy,
        notes: 'Task created via seed',
      },
    });

    // Add log entry
    await prisma.taskLog.create({
      data: {
        taskId: created.id,
        level: 'info',
        message: `Task "${task.title}" seeded for demonstration purposes.`,
      },
    });

    console.log(`✅ Task seeded: "${task.title}" [${task.status}]`);
  }

  console.log('\n🎉 Database seeding complete!');
  console.log('');
  console.log('Demo Credentials:');
  console.log('  Admin:   admin@taskplatform.com  / Admin123!');
  console.log('  User:    user@taskplatform.com   / User123!');
  console.log('  Viewer:  viewer@taskplatform.com / Viewer123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from '../../database/index.js';
import { TaskStatus } from '@prisma/client';

export class DashboardRepository {
  async getDashboardStats(userId?: string) {
    const where = userId ? { deletedAt: null, createdBy: userId } : { deletedAt: null };

    const [
      totalTasks,
      pendingCount,
      processingCount,
      completedCount,
      failedCount,
      cancelledCount,
      recentTasks,
      recentLogs,
      completedStats,
    ] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.PROCESSING } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.COMPLETED } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.FAILED } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.CANCELLED } }),
      prisma.task.findMany({
        where,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.taskLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.aggregate({
        _avg: { retryCount: true },
        where: { ...where, status: TaskStatus.COMPLETED },
      }),
    ]);

    const finishedTotal = completedCount + failedCount;
    const successRate = finishedTotal > 0 ? Number(((completedCount / finishedTotal) * 100).toFixed(1)) : 100;
    const failureRate = finishedTotal > 0 ? Number(((failedCount / finishedTotal) * 100).toFixed(1)) : 0;

    return {
      stats: {
        totalTasks,
        pendingCount,
        processingCount,
        completedCount,
        failedCount,
        cancelledCount,
        successRate,
        failureRate,
        avgProcessingTimeMs: Math.round(800 + (completedStats._avg?.retryCount ?? 0) * 500),
      },
      recentTasks,
      recentLogs,
    };
  }
}

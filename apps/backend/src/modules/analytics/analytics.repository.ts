import { prisma } from '../../database/index.js';
import { TaskStatus } from '@prisma/client';

export class AnalyticsRepository {
  async getMetrics(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [statusBreakdown, priorityBreakdown, totalCount] = await Promise.all([
      prisma.task.groupBy({
        by: ['status'],
        _count: { status: true },
        where: { deletedAt: null },
      }),
      prisma.task.groupBy({
        by: ['priority'],
        _count: { priority: true },
        where: { deletedAt: null },
      }),
      prisma.task.count({ where: { deletedAt: null } }),
    ]);

    // Build real time-series daily data from DB (no synthetic data)
    const timeSeries: Array<{ date: string; completed: number; failed: number; total: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dateStr = dayStart.toISOString().split('T')[0];

      const [total, completed, failed] = await Promise.all([
        prisma.task.count({
          where: { deletedAt: null, createdAt: { gte: dayStart, lte: dayEnd } },
        }),
        prisma.task.count({
          where: { deletedAt: null, status: TaskStatus.COMPLETED, updatedAt: { gte: dayStart, lte: dayEnd } },
        }),
        prisma.task.count({
          where: { deletedAt: null, status: TaskStatus.FAILED, updatedAt: { gte: dayStart, lte: dayEnd } },
        }),
      ]);

      timeSeries.push({ date: dateStr, completed, failed, total });
    }

    const priorityChartData = priorityBreakdown.map((item) => ({
      name: item.priority,
      value: item._count.priority,
    }));

    const statusChartData = statusBreakdown.map((item) => ({
      name: item.status,
      value: item._count.status,
    }));

    return {
      summary: {
        totalCount,
        periodDays: days,
      },
      timeSeries,
      priorityDistribution: priorityChartData,
      statusDistribution: statusChartData,
    };
  }
}

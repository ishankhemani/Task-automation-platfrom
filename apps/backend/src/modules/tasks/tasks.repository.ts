import { prisma } from '../../database/index.js';
import { Prisma, TaskStatus, Priority } from '@prisma/client';
import { TasksListQueryDTO, CreateTaskDTO, UpdateTaskDTO } from './tasks.dto.js';

export class TasksRepository {
  async findManyWithFilters(query: TasksListQueryDTO) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.assignedTo) {
      where.assignedTo = query.assignedTo;
    }

    if (query.createdBy) {
      where.createdBy = query.createdBy;
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: { select: { id: true, name: true, email: true, role: true } },
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdWithDetails(id: string) {
    return prisma.task.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true } },
        history: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        queueJobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async createTask(data: CreateTaskDTO & { createdBy: string }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || Priority.MEDIUM,
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : null,
        assignedTo: data.assignedTo || null,
        attachment: data.attachment || null,
        createdBy: data.createdBy,
        status: TaskStatus.PENDING,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async updateTask(id: string, data: UpdateTaskDTO) {
    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.scheduledTime !== undefined) {
      updateData.scheduledTime = data.scheduledTime ? new Date(data.scheduledTime) : null;
    }
    if (data.assignedTo !== undefined) {
      updateData.assignee = data.assignedTo ? { connect: { id: data.assignedTo } } : { disconnect: true };
    }
    if (data.attachment !== undefined) updateData.attachment = data.attachment;

    return prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async softDeleteTask(id: string) {
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createHistory(taskId: string, oldStatus: TaskStatus | null, newStatus: TaskStatus, changedBy?: string, notes?: string) {
    return prisma.taskHistory.create({
      data: {
        taskId,
        oldStatus,
        newStatus,
        changedBy,
        notes,
      },
    });
  }

  async createLog(taskId: string, level: string, message: string, metadata?: Prisma.InputJsonValue) {
    return prisma.taskLog.create({
      data: {
        taskId,
        level,
        message,
        metadata: metadata ?? Prisma.JsonNull,
      },
    });
  }
}

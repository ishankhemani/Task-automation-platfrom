import { TasksRepository } from './tasks.repository.js';
import { CreateTaskDTO, UpdateTaskDTO, TasksListQueryDTO } from './tasks.dto.js';
import { TaskStatus, Role } from '@prisma/client';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../errors/index.js';
import { queues } from '../../queues/queueManager.js';
import { QUEUES } from '@task-platform/shared';
import { logger } from '../../utils/index.js';

export class TasksService {
  private repository: TasksRepository;

  constructor() {
    this.repository = new TasksRepository();
  }

  async getTasks(query: TasksListQueryDTO, user: { id: string; role: Role }) {
    // Non-admin users only see tasks they created or were assigned to, unless explicitly requesting
    if (user.role !== Role.ADMIN && !query.createdBy) {
      query.createdBy = user.id;
    }
    return this.repository.findManyWithFilters(query);
  }

  async getTaskById(id: string, user: { id: string; role: Role }) {
    const task = await this.repository.findByIdWithDetails(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (user.role !== Role.ADMIN && task.createdBy !== user.id && task.assignedTo !== user.id) {
      throw new ForbiddenError('You do not have permission to view this task');
    }

    return task;
  }

  async createTask(data: CreateTaskDTO, user: { id: string; role: Role }) {
    const task = await this.repository.createTask({
      ...data,
      createdBy: user.id,
    });

    // Record initial status history & creation log
    await Promise.all([
      this.repository.createHistory(task.id, null, TaskStatus.PENDING, user.id, 'Task created'),
      this.repository.createLog(task.id, 'info', `Task "${task.title}" created successfully`, { createdBy: user.id }),
    ]);

    // Dispatch job to BullMQ Queue for asynchronous processing
    let targetQueue = queues[QUEUES.DEFAULT];
    const jobOpts: { delay?: number } = {};

    if (task.scheduledTime) {
      const delayMs = new Date(task.scheduledTime).getTime() - Date.now();
      if (delayMs > 0) {
        jobOpts.delay = delayMs;
        if (queues[QUEUES.SCHEDULED]) {
          targetQueue = queues[QUEUES.SCHEDULED];
        }
      }
    }

    if (targetQueue) {
      await targetQueue
        .add(
          'task:execute',
          {
            taskId: task.id,
            title: task.title,
            payload: { description: task.description, priority: task.priority },
          },
          jobOpts
        )
        .catch((err) => logger.error({ error: err.message }, 'Failed to enqueue task job to BullMQ'));
    }

    return task;
  }

  async updateTask(id: string, data: UpdateTaskDTO, user: { id: string; role: Role }) {
    const existing = await this.repository.findByIdWithDetails(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    if (user.role !== Role.ADMIN && existing.createdBy !== user.id) {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    const oldStatus = existing.status;
    const updated = await this.repository.updateTask(id, data);

    // Track status change if modified
    if (data.status && data.status !== oldStatus) {
      await Promise.all([
        this.repository.createHistory(id, oldStatus, data.status, user.id, `Status updated to ${data.status}`),
        this.repository.createLog(id, 'info', `Task status changed from ${oldStatus} to ${data.status}`),
      ]);
    }

    return updated;
  }

  async deleteTask(id: string, user: { id: string; role: Role }) {
    const existing = await this.repository.findByIdWithDetails(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    if (user.role !== Role.ADMIN && existing.createdBy !== user.id) {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    await this.repository.createLog(id, 'warn', `Task soft deleted by user ${user.id}`);
    return this.repository.softDeleteTask(id);
  }

  async cancelTask(id: string, user: { id: string; role: Role }) {
    const existing = await this.repository.findByIdWithDetails(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    if (user.role !== Role.ADMIN && existing.createdBy !== user.id) {
      throw new ForbiddenError('You do not have permission to cancel this task');
    }

    if (existing.status === TaskStatus.COMPLETED || existing.status === TaskStatus.CANCELLED) {
      throw new BadRequestError(`Cannot cancel task with status ${existing.status}`);
    }

    const updated = await this.repository.updateTask(id, { status: TaskStatus.CANCELLED });
    await Promise.all([
      this.repository.createHistory(id, existing.status, TaskStatus.CANCELLED, user.id, 'Task cancelled by user'),
      this.repository.createLog(id, 'warn', 'Task execution cancelled'),
    ]);

    return updated;
  }

  async retryTask(id: string, user: { id: string; role: Role }) {
    const existing = await this.repository.findByIdWithDetails(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    if (user.role !== Role.ADMIN && existing.createdBy !== user.id) {
      throw new ForbiddenError('You do not have permission to retry this task');
    }

    const updated = await this.repository.updateTask(id, { status: TaskStatus.PENDING });
    await Promise.all([
      this.repository.createHistory(id, existing.status, TaskStatus.PENDING, user.id, 'Task requeued for retry'),
      this.repository.createLog(id, 'info', 'Task retry requested. Status set back to PENDING'),
    ]);

    if (queues[QUEUES.DEFAULT]) {
      await queues[QUEUES.DEFAULT]
        .add('task:execute', {
          taskId: existing.id,
          title: existing.title,
          payload: { description: existing.description, priority: existing.priority },
        })
        .catch((err) => logger.error({ error: err.message }, 'Failed to re-enqueue retry task job to BullMQ'));
    }

    return updated;
  }

  async duplicateTask(id: string, user: { id: string; role: Role }) {
    const existing = await this.repository.findByIdWithDetails(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    const duplicated = await this.createTask(
      {
        title: `${existing.title} (Copy)`,
        description: existing.description || undefined,
        priority: existing.priority,
        assignedTo: existing.assignedTo || undefined,
        attachment: existing.attachment || undefined,
      },
      user
    );

    return duplicated;
  }
}

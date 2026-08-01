import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksService } from '../../modules/tasks/tasks.service.js';
import { Role, TaskStatus, Priority } from '@prisma/client';

vi.mock('../../modules/tasks/tasks.repository.js', () => {
  return {
    TasksRepository: vi.fn().mockImplementation(() => ({
      findManyWithFilters: vi.fn().mockResolvedValue({ tasks: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }),
      findByIdWithDetails: vi.fn().mockImplementation((id: string) => {
        if (id === 'existing-id') {
          return Promise.resolve({
            id: 'existing-id',
            title: 'Sample Task',
            description: 'Sample Description',
            priority: Priority.MEDIUM,
            status: TaskStatus.PENDING,
            createdBy: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return Promise.resolve(null);
      }),
      createTask: vi.fn().mockResolvedValue({
        id: 'new-id',
        title: 'New Task',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        createdBy: 'user-1',
      }),
      updateTask: vi.fn().mockResolvedValue({
        id: 'existing-id',
        status: TaskStatus.CANCELLED,
      }),
      softDeleteTask: vi.fn().mockResolvedValue({ id: 'existing-id', deletedAt: new Date() }),
      createHistory: vi.fn().mockResolvedValue({}),
      createLog: vi.fn().mockResolvedValue({}),
    })),
  };
});

describe('TasksService', () => {
  let service: TasksService;
  const mockUser = { id: 'user-1', role: Role.USER };
  const mockAdmin = { id: 'admin-1', role: Role.ADMIN };

  beforeEach(() => {
    service = new TasksService();
  });

  describe('getTaskById', () => {
    it('should return task when requested by owner', async () => {
      const task = await service.getTaskById('existing-id', mockUser);
      expect(task).toBeDefined();
      expect(task.id).toBe('existing-id');
    });

    it('should throw ForbiddenError when requested by unauthorized user', async () => {
      const otherUser = { id: 'user-2', role: Role.USER };
      await expect(service.getTaskById('existing-id', otherUser)).rejects.toThrow();
    });

    it('should allow admin to view any task', async () => {
      const task = await service.getTaskById('existing-id', mockAdmin);
      expect(task).toBeDefined();
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const task = await service.createTask(
        { title: 'New Task', priority: Priority.HIGH },
        mockUser
      );
      expect(task).toBeDefined();
      expect(task.title).toBe('New Task');
    });
  });

  describe('cancelTask', () => {
    it('should cancel pending task', async () => {
      const task = await service.cancelTask('existing-id', mockUser);
      expect(task.status).toBe(TaskStatus.CANCELLED);
    });
  });
});

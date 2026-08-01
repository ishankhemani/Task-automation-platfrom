import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { TasksService } from './tasks.service.js';
import { sendSuccess } from '../../utils/response.js';
import { Role } from '@prisma/client';

const service = new TasksService();

export class TasksController {
  static async getTasks(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const result = await service.getTasks(req.query, user);
    return sendSuccess(res, result.tasks, 'Tasks retrieved successfully', 200, result.meta);
  }

  static async getTaskById(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.getTaskById(req.params.id, user);
    return sendSuccess(res, task, 'Task details retrieved successfully');
  }

  static async createTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.createTask(req.body, user);
    return sendSuccess(res, task, 'Task created successfully', 201);
  }

  static async updateTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.updateTask(req.params.id, req.body, user);
    return sendSuccess(res, task, 'Task updated successfully');
  }

  static async deleteTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    await service.deleteTask(req.params.id, user);
    return sendSuccess(res, null, 'Task deleted successfully');
  }

  static async cancelTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.cancelTask(req.params.id, user);
    return sendSuccess(res, task, 'Task cancelled successfully');
  }

  static async retryTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.retryTask(req.params.id, user);
    return sendSuccess(res, task, 'Task queued for retry successfully');
  }

  static async duplicateTask(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const task = await service.duplicateTask(req.params.id, user);
    return sendSuccess(res, task, 'Task duplicated successfully', 201);
  }
}

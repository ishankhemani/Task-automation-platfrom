import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { NotificationsService } from './notifications.service.js';
import { sendSuccess } from '../../utils/response.js';

const service = new NotificationsService();

export class NotificationsController {
  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    const notifications = await service.getUserNotifications(req.user!.id);
    return sendSuccess(res, notifications, 'Notifications retrieved successfully');
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response) {
    await service.markAsRead(req.params.id, req.user!.id);
    return sendSuccess(res, null, 'Notification marked as read');
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    await service.markAllAsRead(req.user!.id);
    return sendSuccess(res, null, 'All notifications marked as read');
  }
}

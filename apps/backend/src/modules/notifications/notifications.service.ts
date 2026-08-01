import { NotificationsRepository } from './notifications.repository.js';

export class NotificationsService {
  private repository: NotificationsRepository;

  constructor() {
    this.repository = new NotificationsRepository();
  }

  async getUserNotifications(userId: string) {
    return this.repository.findUserNotifications(userId);
  }

  async markAsRead(id: string, userId: string) {
    return this.repository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }
}

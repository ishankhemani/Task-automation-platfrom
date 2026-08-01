import { DashboardRepository } from './dashboard.repository.js';
import { Role } from '@prisma/client';

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async getDashboardStats(user: { id: string; role: Role }) {
    const userIdFilter = user.role === Role.ADMIN ? undefined : user.id;
    return this.repository.getDashboardStats(userIdFilter);
  }
}

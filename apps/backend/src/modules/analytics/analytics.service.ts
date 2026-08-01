import { AnalyticsRepository } from './analytics.repository.js';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getMetrics(days: number) {
    return this.repository.getMetrics(days);
  }
}

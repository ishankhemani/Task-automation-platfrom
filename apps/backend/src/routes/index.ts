import { Router } from 'express';
import { healthRouter } from './health.js';

export const router = Router();

// Infrastructure & Health check
router.use('/health', healthRouter);

// NOTE: All module routes are registered directly in app.ts
// Auth:          /api/v1/auth         → modules/auth/auth.route.ts
// Tasks:         /api/v1/tasks        → modules/tasks/tasks.route.ts
// Dashboard:     /api/v1/dashboard    → modules/dashboard/dashboard.route.ts
// Analytics:     /api/v1/analytics    → modules/analytics/analytics.route.ts
// Queues:        /api/v1/queues       → modules/queue/queue.route.ts
// Notifications: /api/v1/notifications → modules/notifications/notifications.route.ts
// Uploads:       /api/v1/uploads      → modules/uploads/uploads.route.ts
// Users:         /api/v1/users        → modules/users/users.route.ts
// Admin:         /api/v1/admin        → modules/admin/admin.route.ts
// Health:        /api/v1/health       → modules/health/health.route.ts

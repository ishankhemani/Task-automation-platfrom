// Shared system constants (Queue names, socket channels, event definitions)

export const QUEUES = {
  DEFAULT: 'default-task-queue',
  PRIORITY: 'priority-task-queue',
  SCHEDULED: 'scheduled-task-queue',
  WORKFLOW: 'workflow-queue',
} as const;

export const SOCKET_EVENTS = {
  JOB_PROGRESS: 'job:progress',
  JOB_COMPLETED: 'job:completed',
  JOB_FAILED: 'job:failed',
  METRICS_UPDATE: 'metrics:update',
  WORKER_STATUS: 'worker:status',
  SUBSCRIBE_TASK: 'subscribe:task',
  UNSUBSCRIBE_TASK: 'unsubscribe:task',
} as const;

export const API_PREFIX = '/api/v1';

export const API_ROUTES = {
  HEALTH: '/health',
  AUTH: '/auth',
  TASKS: '/tasks',
  WORKFLOWS: '/workflows',
  QUEUES: '/queues',
  WORKERS: '/workers',
  LOGS: '/logs',
  ANALYTICS: '/analytics',
} as const;

export const SYSTEM_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  TOKEN_EXPIRY: '1d',
  REFRESH_TOKEN_EXPIRY: '7d',
} as const;


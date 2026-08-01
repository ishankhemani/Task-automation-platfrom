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
  SUBSCRIBE_TASK: 'subscribe:task',
  UNSUBSCRIBE_TASK: 'unsubscribe:task',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  QUEUES: '/queues',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN_USERS: '/admin/users',
  ADMIN_WORKERS: '/admin/workers',
  ADMIN_LOGS: '/admin/logs',
} as const;

export const STORAGE_KEYS = {
  THEME: 'task_platform_theme',
  SIDEBAR_COLLAPSED: 'task_platform_sidebar_collapsed',
} as const;

export const QUERY_KEYS = {
  AUTH_USER: ['auth', 'user'],
  TASKS: ['tasks'],
  TASK_DETAIL: (id: string) => ['tasks', id],
  QUEUES: ['queues'],
  QUEUE_STATS: ['queues', 'stats'],
  ANALYTICS_METRICS: ['analytics', 'metrics'],
  NOTIFICATIONS: ['notifications'],
  USERS: ['users'],
  WORKERS: ['workers'],
  ACTIVITY_LOGS: ['activity', 'logs'],
} as const;

import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SOCKET_EVENTS, IJobProgressPayload, IQueueStats } from '@task-platform/shared';
import { config } from '../config/index.js';
import { logger } from '../utils/index.js';
import { prisma } from '../services/prisma.js';

let ioInstance: Server | null = null;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

/**
 * Socket.IO JWT authentication middleware
 */
function socketAuthMiddleware(socket: AuthenticatedSocket, next: (err?: Error) => void): void {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    // Allow unauthenticated connections for public events, but mark them
    logger.debug(`Socket ${socket.id} connected without authentication`);
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { id: string; role: string };

    prisma.user
      .findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true },
      })
      .then((user) => {
        if (user) {
          socket.userId = user.id;
          socket.userRole = user.role;
          logger.debug({ userId: user.id, socketId: socket.id }, 'Socket authenticated');
        }
        next();
      })
      .catch((err) => {
        logger.error({ error: err.message }, 'Socket auth DB error');
        next();
      });
  } catch {
    logger.debug({ socketId: socket.id }, 'Socket auth token expired or invalid, connecting unauthenticated');
    next();
  }
}

export function initializeSocketServer(io: Server): void {
  ioInstance = io;

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId || 'anonymous';
    logger.info({ socketId: socket.id, userId }, '⚡ Socket client connected');

    // If authenticated, join user-specific room for notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      logger.debug(`Socket ${socket.id} joined user room: user:${socket.userId}`);
    }

    socket.on(SOCKET_EVENTS.SUBSCRIBE_TASK, (taskId: string) => {
      if (taskId) {
        socket.join(`task:${taskId}`);
        logger.debug(`Socket ${socket.id} subscribed to task:${taskId}`);
      }
    });

    socket.on(SOCKET_EVENTS.UNSUBSCRIBE_TASK, (taskId: string) => {
      if (taskId) {
        socket.leave(`task:${taskId}`);
        logger.debug(`Socket ${socket.id} unsubscribed from task:${taskId}`);
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, userId, reason }, '⚡ Socket client disconnected');
    });
  });
}

export function broadcastJobProgress(payload: IJobProgressPayload): void {
  if (ioInstance) {
    ioInstance.to(`task:${payload.taskId}`).emit(SOCKET_EVENTS.JOB_PROGRESS, payload);
    ioInstance.emit(SOCKET_EVENTS.JOB_PROGRESS, payload);
  }
}

export function broadcastJobCompleted(data: { taskId: string; result?: unknown; durationMs?: number }): void {
  if (ioInstance) {
    ioInstance.to(`task:${data.taskId}`).emit(SOCKET_EVENTS.JOB_COMPLETED, data);
    ioInstance.emit(SOCKET_EVENTS.JOB_COMPLETED, data);
  }
}

export function broadcastJobFailed(data: { taskId: string; error: string; attemptCount?: number }): void {
  if (ioInstance) {
    ioInstance.to(`task:${data.taskId}`).emit(SOCKET_EVENTS.JOB_FAILED, data);
    ioInstance.emit(SOCKET_EVENTS.JOB_FAILED, data);
  }
}

export function broadcastMetricsUpdate(metrics: IQueueStats[]): void {
  if (ioInstance) {
    ioInstance.emit(SOCKET_EVENTS.METRICS_UPDATE, metrics);
  }
}

/**
 * Send notification to a specific user via their socket room
 */
export function sendUserNotification(userId: string, notification: unknown): void {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit('notification:new', notification);
  }
}

export function getSocketServer(): Server | null {
  return ioInstance;
}

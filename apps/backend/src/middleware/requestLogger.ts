import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const user = (req as { user?: { id?: string } }).user;
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
  
  // Attach to request for downstream use
  (req as unknown as Record<string, unknown>).id = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      requestId,
      correlationId,
      userId: user?.id || 'anonymous',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      executionTime: duration,
      ip: req.ip,
      status: res.statusCode >= 400 ? 'ERROR' : 'SUCCESS'
    }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
  
  // Attach to request for downstream use (cast to any to avoid interface extension issues)
  (req as any).id = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      requestId,
      correlationId,
      userId: (req as any).user?.id || 'anonymous',
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

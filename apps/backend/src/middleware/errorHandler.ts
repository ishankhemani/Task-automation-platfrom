import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/index.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Unhandled error
  logger.error(err, 'Unhandled error');
  sendError(res, 'Internal Server Error', 500, err.message);
}

// CSRF protection middleware
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '../errors/index.js';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = '_csrf';

/**
 * Generate a CSRF token and set it as a cookie
 */
export function generateCsrfToken(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  next();
}

/**
 * Validate CSRF token on state-changing requests.
 * Compares the token from the request header with the cookie.
 * Safe methods (GET, HEAD, OPTIONS) are skipped.
 */
export function validateCsrfToken(req: Request, _res: Response, next: NextFunction): void {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Skip CSRF for API routes using Bearer token authentication
  // (CSRF is primarily for cookie-based auth)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER] as string;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(new AppError('Invalid CSRF token', 403));
    return;
  }

  next();
}

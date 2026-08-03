// Input sanitization middleware for XSS protection
import { Request, Response, NextFunction } from 'express';

/**
 * Recursively sanitize strings in an object to prevent XSS attacks.
 * Escapes HTML special characters: < > " ' & /
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to prevent XSS attacks via user input.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    const { password, confirmPassword, newPassword, currentPassword, ...rest } = req.body;
    const sanitizedRest = sanitizeValue(rest) as Record<string, unknown>;
    req.body = {
      ...sanitizedRest,
      ...(password !== undefined && { password }),
      ...(confirmPassword !== undefined && { confirmPassword }),
      ...(newPassword !== undefined && { newPassword }),
      ...(currentPassword !== undefined && { currentPassword }),
    };
  }

  if (req.query && typeof req.query === 'object') {
    // Cast back to QueryString.ParsedQs after sanitization
    req.query = sanitizeValue(req.query) as typeof req.query;
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params) as typeof req.params;
  }

  next();
}

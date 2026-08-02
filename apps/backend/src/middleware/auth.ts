import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { prisma } from '../services/prisma.js';

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    next(new UnauthorizedError('Authentication token required'));
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    prisma.user
      .findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, avatar: true },
      })
      .then((user) => {
        if (!user) {
          next(new UnauthorizedError('User belonging to this token no longer exists'));
          return;
        }
        (req as AuthenticatedRequest).user = user;
        next();
      })
      .catch(() => {
        next(new UnauthorizedError('Invalid authentication token'));
      });
  } catch {
    next(new UnauthorizedError('Invalid or expired authentication token'));
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(new ForbiddenError('Insufficient permissions to perform this action'));
      return;
    }

    next();
  };
}

export const roleGuard = requireRole;


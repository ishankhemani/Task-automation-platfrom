import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

// Mock config before importing middleware
vi.mock('../../config/index.js', () => ({
  config: {
    jwt: {
      accessSecret: 'test-access-secret-key-12345',
      refreshSecret: 'test-refresh-secret-key-12345',
      expiresIn: '15m',
    },
    isDevelopment: true,
    env: 'test',
  },
}));

// Mock prisma
vi.mock('../../services/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import jwt from 'jsonwebtoken';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { prisma } from '../../services/prisma.js';

function createMockReq(overrides = {}): Partial<Request> {
  return {
    headers: {},
    ...overrides,
  };
}

function createMockRes(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('Auth Middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn() as unknown as NextFunction;
  });

  describe('authenticate', () => {
    it('should call next with UnauthorizedError when no token provided', () => {
      const req = createMockReq() as Request;
      const res = createMockRes() as Response;

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication token required',
          statusCode: 401,
        })
      );
    });

    it('should call next with UnauthorizedError when token is invalid', () => {
      const req = createMockReq({
        headers: { authorization: 'Bearer invalid-token' },
      }) as Request;
      const res = createMockRes() as Response;

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired authentication token',
          statusCode: 401,
        })
      );
    });

    it('should authenticate user with valid token', async () => {
      const token = jwt.sign({ id: 'uuid-1', role: 'USER' }, 'test-access-secret-key-12345');
      const req = createMockReq({
        headers: { authorization: `Bearer ${token}` },
      }) as Request;
      const res = createMockRes() as Response;

      const mockUser = {
        id: 'uuid-1',
        name: 'John',
        email: 'john@example.com',
        role: 'USER',
        avatar: null,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      authenticate(req, res, next);

      // Wait for the async prisma call to resolve
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('requireRole', () => {
    it('should call next when user has allowed role', () => {
      const middleware = requireRole(['ADMIN', 'USER']);
      const req = createMockReq() as Request;
      (req as unknown as { user: unknown }).user = { id: 'uuid-1', name: 'John', email: 'john@example.com', role: 'ADMIN', avatar: null };
      const res = createMockRes() as Response;

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with ForbiddenError when user lacks role', () => {
      const middleware = requireRole(['ADMIN']);
      const req = createMockReq() as Request;
      (req as unknown as { user: unknown }).user = { id: 'uuid-1', name: 'John', email: 'john@example.com', role: 'USER', avatar: null };
      const res = createMockRes() as Response;

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
        })
      );
    });

    it('should call next with UnauthorizedError when no user', () => {
      const middleware = requireRole(['ADMIN']);
      const req = createMockReq() as Request;
      const res = createMockRes() as Response;

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        })
      );
    });
  });
});

describe('Validate Middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn() as unknown as NextFunction;
  });

  it('should be importable', async () => {
    const { validate } = await import('../../middleware/validate.js');
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });
});

describe('Sanitize Middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn() as unknown as NextFunction;
  });

  it('should sanitize XSS from request body', async () => {
    const { sanitizeInput } = await import('../../middleware/sanitize.js');
    const req = createMockReq({
      body: { name: '<script>alert("xss")</script>' },
      query: {},
      params: {},
    }) as Request;
    const res = createMockRes() as Response;

    sanitizeInput(req, res, next);

    expect(req.body.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(next).toHaveBeenCalled();
  });

  it('should sanitize nested objects', async () => {
    const { sanitizeInput } = await import('../../middleware/sanitize.js');
    const req = createMockReq({
      body: { user: { name: '<img src=x onerror=alert(1)>' } },
      query: {},
      params: {},
    }) as Request;
    const res = createMockRes() as Response;

    sanitizeInput(req, res, next);

    expect(req.body.user.name).not.toContain('<img');
    expect(next).toHaveBeenCalled();
  });
});

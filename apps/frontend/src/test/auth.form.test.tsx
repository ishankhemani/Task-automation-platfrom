import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@task-platform/shared';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid email and password', () => {
      const validData = {
        body: {
          email: 'user@example.com',
          password: 'Password123!',
        },
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const invalidData = {
        body: {
          email: 'not-an-email',
          password: 'password123',
        },
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid registration input', () => {
      const validData = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Password123!',
        },
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const invalidData = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'weak',
        },
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

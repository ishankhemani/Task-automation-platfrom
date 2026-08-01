import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../modules/auth/auth.service.js';
import { AuthRepository } from '../../modules/auth/auth.repository.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../errors/index.js';

// Mock the repository
vi.mock('../../modules/auth/auth.repository.js', () => ({
  AuthRepository: {
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    findUserByIdWithPassword: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
    revokeAllUserTokens: vi.fn(),
    updateLastLogin: vi.fn(),
    updateUserPassword: vi.fn(),
    createActivityLog: vi.fn(),
  },
}));

// Mock config
vi.mock('../../config/index.js', () => ({
  config: {
    jwt: {
      accessSecret: 'test-access-secret-key-12345',
      refreshSecret: 'test-refresh-secret-key-12345',
      expiresIn: '15m',
      refreshExpiresIn: '7d',
    },
    isDevelopment: true,
    env: 'test',
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const mockUser = {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        role: 'USER',
        avatar: null,
        isVerified: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        lastLogin: null,
      };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(null);
      vi.mocked(AuthRepository.createUser).mockResolvedValue(mockUser as never);
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      const result = await AuthService.register(dto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('john@example.com');
      expect(result.name).toBe('John Doe');
      expect(AuthRepository.findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(AuthRepository.createUser).toHaveBeenCalled();
    });

    it('should throw ConflictError if email already exists', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue({
        id: 'uuid-1',
        email: 'john@example.com',
      } as never);

      await expect(AuthService.register(dto)).rejects.toThrow(ConflictError);
    });

    it('should hash the password before storing', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(null);
      vi.mocked(AuthRepository.createUser).mockImplementation(async (data: { password: string }) => {
        // Verify the password was hashed
        const isHashed = await bcrypt.compare('password123', data.password);
        expect(isHashed).toBe(true);
        return { id: 'uuid-1', ...data, role: 'USER', avatar: null, isVerified: false, status: 'ACTIVE' } as never;
      });
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      await AuthService.register(dto);

      expect(AuthRepository.createUser).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto = { email: 'john@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'USER',
        avatar: null,
        isVerified: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        lastLogin: null,
      };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(mockUser as never);
      vi.mocked(AuthRepository.createRefreshToken).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.updateLastLogin).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      const result = await AuthService.login(dto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      const dto = { email: 'john@example.com', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'uuid-1',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'USER',
      };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(mockUser as never);

      await expect(AuthService.login(dto)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      const dto = { email: 'nonexistent@example.com', password: 'password123' };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(null);

      await expect(AuthService.login(dto)).rejects.toThrow(UnauthorizedError);
    });

    it('should create a refresh token in the database', async () => {
      const dto = { email: 'john@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'USER',
        avatar: null,
        isVerified: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        lastLogin: null,
      };

      vi.mocked(AuthRepository.findUserByEmail).mockResolvedValue(mockUser as never);
      vi.mocked(AuthRepository.createRefreshToken).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.updateLastLogin).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      await AuthService.login(dto);

      expect(AuthRepository.createRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'uuid-1',
          token: expect.any(String),
          expiresAt: expect.any(Date),
        })
      );
    });
  });

  describe('refreshToken', () => {
    it('should rotate tokens successfully', async () => {
      const userId = 'uuid-1';
      const oldToken = jwt.sign({ id: userId }, 'test-refresh-secret-key-12345', { expiresIn: '7d' });

      vi.mocked(AuthRepository.findRefreshToken).mockResolvedValue({
        id: 'token-id',
        token: oldToken,
        userId,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      vi.mocked(AuthRepository.findUserById).mockResolvedValue({
        id: userId,
        name: 'John',
        email: 'john@example.com',
        role: 'USER',
        avatar: null,
        isVerified: false,
        status: 'ACTIVE',
      } as never);
      vi.mocked(AuthRepository.revokeRefreshToken).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.createRefreshToken).mockResolvedValue({} as never);

      const result = await AuthService.refreshToken(oldToken);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(AuthRepository.revokeRefreshToken).toHaveBeenCalledWith('token-id');
      expect(AuthRepository.createRefreshToken).toHaveBeenCalled();
    });

    it('should throw for revoked token', async () => {
      const userId = 'uuid-1';
      const oldToken = jwt.sign({ id: userId }, 'test-refresh-secret-key-12345', { expiresIn: '7d' });

      vi.mocked(AuthRepository.findRefreshToken).mockResolvedValue({
        id: 'token-id',
        token: oldToken,
        userId,
        isRevoked: true,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await expect(AuthService.refreshToken(oldToken)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      const token = 'some-refresh-token';

      vi.mocked(AuthRepository.findRefreshToken).mockResolvedValue({
        id: 'token-id',
        token,
        userId: 'uuid-1',
        isRevoked: false,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      vi.mocked(AuthRepository.revokeRefreshToken).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      await AuthService.logout(token, 'uuid-1');

      expect(AuthRepository.revokeRefreshToken).toHaveBeenCalledWith('token-id');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 12);
      const mockUser = {
        id: 'uuid-1',
        name: 'John',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'USER',
        avatar: null,
        isVerified: false,
        status: 'ACTIVE',
      };

      vi.mocked(AuthRepository.findUserByIdWithPassword).mockResolvedValue(mockUser as never);
      vi.mocked(AuthRepository.updateUserPassword).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.revokeAllUserTokens).mockResolvedValue({} as never);
      vi.mocked(AuthRepository.createActivityLog).mockResolvedValue({} as never);

      await AuthService.changePassword('uuid-1', {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      });

      expect(AuthRepository.updateUserPassword).toHaveBeenCalledWith('uuid-1', expect.any(String));
      expect(AuthRepository.revokeAllUserTokens).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw if current password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 12);
      const mockUser = {
        id: 'uuid-1',
        password: hashedPassword,
      };

      vi.mocked(AuthRepository.findUserByIdWithPassword).mockResolvedValue(mockUser as never);

      await expect(
        AuthService.changePassword('uuid-1', {
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw if user not found', async () => {
      vi.mocked(AuthRepository.findUserByIdWithPassword).mockResolvedValue(null);

      await expect(
        AuthService.changePassword('uuid-1', {
          currentPassword: 'old',
          newPassword: 'new12345',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });
});

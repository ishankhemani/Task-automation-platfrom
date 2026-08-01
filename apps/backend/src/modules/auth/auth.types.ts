// Auth module types
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  isVerified: boolean;
  status: string;
}

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
}

export interface PasswordResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

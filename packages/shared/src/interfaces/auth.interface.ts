import { UserRole } from '../enums/index.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

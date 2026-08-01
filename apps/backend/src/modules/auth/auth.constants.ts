// Auth module constants
export const AUTH_CONSTANTS = {
  SALT_ROUNDS: 12,
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  PASSWORD_RESET_EXPIRY_MS: 60 * 60 * 1000, // 1 hour in ms
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
} as const;

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_ALL_SUCCESS: 'Logged out from all devices successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_SENT: 'If an account with that email exists, a password reset link has been sent',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'A user with this email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  AUTH_REQUIRED: 'Authentication token required',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
  SAME_PASSWORD: 'New password must be different from current password',
} as const;

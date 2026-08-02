import { UsersRepository } from './users.repository.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UsersService {
  static async getUsers(params: { page?: number; limit?: number; search?: string; role?: Role }) {
    return UsersRepository.findUsers(params);
  }

  static async getUserById(id: string) {
    const user = await UsersRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async updateUser(id: string, data: { name?: string; role?: Role; status?: string; avatar?: string }) {
    const existing = await UsersRepository.findUserById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    return UsersRepository.updateUser(id, data);
  }

  static async getProfile(userId: string) {
    const user = await UsersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  static async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    const user = await UsersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return UsersRepository.updateUser(userId, data);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UsersRepository.findUserWithPassword(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UsersRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password updated successfully' };
  }

  static async deleteUser(id: string) {
    const existing = await UsersRepository.findUserById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    return UsersRepository.softDeleteUser(id);
  }
}

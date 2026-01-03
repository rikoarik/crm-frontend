import { apiClient } from './client';
import { User } from '../types';

export interface CreateUserDto {
  username: string;
  email?: string;
  password: string;
  role: 'superadmin' | 'admin';
  provinceId?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'superadmin' | 'admin';
  provinceId?: string;
  isActive?: boolean;
}

export const usersApi = {
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>('/users', data);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  async assignProvince(userId: string, provinceId: string): Promise<User> {
    return apiClient.patch<User>(`/users/${userId}/province`, { provinceId });
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  },
};


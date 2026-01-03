import { apiClient } from './client';
import { AuthUser } from '../types';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
  },

  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/auth/logout', {
      refreshToken,
    });
  },
};


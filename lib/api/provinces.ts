import { apiClient } from './client';
import { Province } from '../types';

export const provincesApi = {
  async getAllProvinces(): Promise<Province[]> {
    return apiClient.get<Province[]>('/provinces');
  },

  async getProvinceById(id: string): Promise<Province> {
    return apiClient.get<Province>(`/provinces/${id}`);
  },

  async seedProvinces(): Promise<{ message: string; count: number }> {
    return apiClient.post<{ message: string; count: number }>('/provinces/seed');
  },
};


import { apiClient } from './client';
import { Lead, LeadStatus } from '../types';

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  category?: string;
  status?: string[];
}

export interface LeadsResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  total: number;
  contacted: number;
  interested: number;
  deal: number;
}

export interface MetaResponse {
  cities: string[];
  categories: string[];
}

export const leadsApi = {
  async getLeads(params?: GetLeadsParams): Promise<LeadsResponse> {
    return apiClient.get<LeadsResponse>('/leads', params);
  },

  async getLead(id: string): Promise<Lead> {
    return apiClient.get<Lead>(`/leads/${id}`);
  },

  async createLead(data: Omit<Lead, 'id'>): Promise<Lead> {
    return apiClient.post<Lead>('/leads', data);
  },

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return apiClient.patch<Lead>(`/leads/${id}`, data);
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    return apiClient.patch<Lead>(`/leads/${id}/status`, { status });
  },

  async deleteLead(id: string): Promise<void> {
    return apiClient.delete<void>(`/leads/${id}`);
  },

  async getStats(): Promise<StatsResponse> {
    return apiClient.get<StatsResponse>('/leads/stats');
  },

  async getMeta(): Promise<MetaResponse> {
    return apiClient.get<MetaResponse>('/leads/meta');
  },
};

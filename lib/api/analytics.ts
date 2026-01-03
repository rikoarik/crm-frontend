import { apiClient } from './client';

export interface CityDistribution {
  city: string;
  count: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  [key: string]: string | number;  // Index signature for Recharts compatibility
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface ConversionFunnel {
  new: number;
  contacted: number;
  interested: number;
  deal: number;
  conversionRate: string;
}

export interface DetailedCategoryAnalytics {
  category: string;
  total: number;
  new: number;
  contacted: number;
  interested: number;
  deal: number;
  conversionRate: number;
  topCities: { city: string; count: number }[];
}

export interface TrendData {
  date: string;
  total: number;
  deal: number;
}

export interface BusinessInsight {
  type: string;
  total: number;
  new: number;
  contacted: number;
  interested: number;
  deal: number;
  conversionRate: number;
  avgDaysToConversion: number;
}

export const analyticsApi = {
  async getCityDistribution(): Promise<CityDistribution[]> {
    return apiClient.get<CityDistribution[]>('/analytics/cities');
  },

  async getCategoryDistribution(): Promise<CategoryDistribution[]> {
    return apiClient.get<CategoryDistribution[]>('/analytics/categories');
  },

  async getStatusDistribution(): Promise<StatusDistribution[]> {
    return apiClient.get<StatusDistribution[]>('/analytics/status');
  },

  async getConversionFunnel(): Promise<ConversionFunnel> {
    return apiClient.get<ConversionFunnel>('/analytics/funnel');
  },

  async getDetailedCategoryAnalytics(): Promise<DetailedCategoryAnalytics[]> {
    return apiClient.get<DetailedCategoryAnalytics[]>('/analytics/categories/detailed');
  },

  async getTrends(startDate?: string, endDate?: string, category?: string): Promise<TrendData[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (category) params.category = category;
    return apiClient.get<TrendData[]>('/analytics/trends', params);
  },

  async getBusinessInsights(): Promise<BusinessInsight[]> {
    return apiClient.get<BusinessInsight[]>('/analytics/business-insights');
  },
};

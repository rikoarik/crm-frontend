import { apiClient } from './client';

export interface Proposal {
  id: string;
  lead_id: string;
  title: string;
  content: string;
  template_id?: string;
  generated_by: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  leads?: any;
  proposal_templates?: any;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  category?: string;
  content: string;
  is_default: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateProposalRequest {
  leadId: string;
  templateId?: string;
}

export interface CreateTemplateRequest {
  name: string;
  content: string;
  category?: string;
  isDefault?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  content?: string;
  category?: string;
  isDefault?: boolean;
}

export const proposalsApi = {
  async generateProposal(data: GenerateProposalRequest): Promise<Proposal> {
    return apiClient.post<Proposal>('/proposals/generate', data);
  },

  async getProposals(leadId?: string): Promise<Proposal[]> {
    const params = leadId ? { leadId } : {};
    return apiClient.get<Proposal[]>('/proposals', params);
  },

  async getProposal(id: string): Promise<Proposal> {
    return apiClient.get<Proposal>(`/proposals/${id}`);
  },

  async updateProposal(id: string, data: Partial<Proposal>): Promise<Proposal> {
    return apiClient.patch<Proposal>(`/proposals/${id}`, data);
  },

  async deleteProposal(id: string): Promise<void> {
    return apiClient.delete<void>(`/proposals/${id}`);
  },

  async getTemplates(): Promise<ProposalTemplate[]> {
    return apiClient.get<ProposalTemplate[]>('/proposals/templates/list');
  },

  async getTemplate(id: string): Promise<ProposalTemplate> {
    return apiClient.get<ProposalTemplate>(`/proposals/templates/${id}`);
  },

  async createTemplate(data: CreateTemplateRequest): Promise<ProposalTemplate> {
    return apiClient.post<ProposalTemplate>('/proposals/templates', data);
  },

  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<ProposalTemplate> {
    return apiClient.patch<ProposalTemplate>(`/proposals/templates/${id}`, data);
  },

  async deleteTemplate(id: string): Promise<void> {
    return apiClient.delete<void>(`/proposals/templates/${id}`);
  },
};


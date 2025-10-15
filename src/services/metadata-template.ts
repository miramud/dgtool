import { apiClient } from '@/lib/api-client';
import { IResponse } from '@/types/http';
import {
  MetadataTemplate,
  CreateMetadataTemplateRequest,
  UpdateMetadataTemplateRequest,
  MetadataTemplateFilters,
  MetadataTemplateListResponse,
} from '@/types/metadata-template';

export const metadataTemplateService = {
  async getTemplates(filters?: MetadataTemplateFilters): Promise<IResponse<MetadataTemplateListResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const url = `/api/v1/templates${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<IResponse<MetadataTemplateListResponse>>(url);
    return response.data;
  },

  async createTemplate(data: CreateMetadataTemplateRequest): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.post<IResponse<MetadataTemplate>>('/api/v1/templates', data);
    return response.data;
  },

  async getTemplateById(id: string): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.get<IResponse<MetadataTemplate>>(`/api/v1/templates/${id}`);
    return response.data;
  },

  async updateTemplate(id: string, data: UpdateMetadataTemplateRequest): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.put<IResponse<MetadataTemplate>>(`/api/v1/templates/${id}`, data);
    return response.data;
  },

  async partialUpdateTemplate(id: string, data: Partial<UpdateMetadataTemplateRequest>): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.patch<IResponse<MetadataTemplate>>(`/api/v1/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(`/api/v1/templates/${id}`);
    return response.data;
  },

  async activateTemplate(id: string): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.post<IResponse<MetadataTemplate>>(`/api/v1/templates/${id}/activate`);
    return response.data;
  },

  async deactivateTemplate(id: string): Promise<IResponse<MetadataTemplate>> {
    const response = await apiClient.post<IResponse<MetadataTemplate>>(`/api/v1/templates/${id}/deactivate`);
    return response.data;
  },
};
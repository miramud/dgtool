import { apiClient } from '@/lib/api-client';
import { IResponse } from '@/types/http';
import { DATASET_TYPE_ROUTES } from '@/constants/api-routes';
import {
  DatasetType,
  CreateDatasetTypeRequest,
  DatasetTypeApiResponse,
} from '@/modules/metadataLibrary/types/datasetType';

export interface DatasetTypeFilters {
  search?: string;
  is_archived?: boolean;
  page?: number;
  page_size?: number;
}

export interface UpdateDatasetTypeRequest {
  name: string;
  description: string;
}

export const datasetTypeService = {
  async getDatasetTypes(filters?: DatasetTypeFilters): Promise<DatasetTypeApiResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.is_archived !== undefined) params.append('is_archived', String(filters.is_archived));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));

    const queryString = params.toString();
    const url = `${DATASET_TYPE_ROUTES.LIST}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<DatasetTypeApiResponse>(url);
    return response.data;
  },

  async createDatasetType(data: CreateDatasetTypeRequest): Promise<IResponse<DatasetType>> {
    const response = await apiClient.post<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.CREATE, data);
    return response.data;
  },

  async getDatasetTypeById(id: string): Promise<IResponse<DatasetType>> {
    const response = await apiClient.get<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.GET_BY_ID(id));
    return response.data;
  },

  async updateDatasetType(id: string, data: UpdateDatasetTypeRequest): Promise<IResponse<DatasetType>> {
    const response = await apiClient.put<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.UPDATE(id), data);
    return response.data;
  },

  async partialUpdateDatasetType(id: string, data: Partial<UpdateDatasetTypeRequest>): Promise<IResponse<DatasetType>> {
    const response = await apiClient.patch<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.PARTIAL_UPDATE(id), data);
    return response.data;
  },

  async deleteDatasetType(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(DATASET_TYPE_ROUTES.DELETE(id));
    return response.data;
  },

  async archiveDatasetType(id: string): Promise<IResponse<DatasetType>> {
    const response = await apiClient.post<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.ARCHIVE(id));
    return response.data;
  },

  async unarchiveDatasetType(id: string): Promise<IResponse<DatasetType>> {
    const response = await apiClient.post<IResponse<DatasetType>>(DATASET_TYPE_ROUTES.UNARCHIVE(id));
    return response.data;
  },
};
import { METADATA_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  MetadataTemplate,
  // CreateMetadataTemplateRequest,
  CreateMetadataTemplateApiRequest,
  UpdateMetadataTemplateRequest,
  MetadataTemplateFilters,
  MetadataTemplateListResponse,
} from "../types/metadataTemplate";

export interface MetadataTemplateResponse {
  status: boolean;
  message: string;
  data: MetadataTemplate;
}

export interface MetadataTemplatesListResponse {
  status: boolean;
  message: string;
  data: MetadataTemplateListResponse;
}

// Hook for listing all metadata templates
export const useGetMetadataTemplates = (filters?: MetadataTemplateFilters) => {
  return useQuery({
    queryKey: ["metadata-templates", filters],
    queryFn: async () => {
      const { axiosCallerWithToken } = await import("@/lib/helpers");

      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.isActive !== undefined)
        params.append("isActive", String(filters.isActive));
      if (filters?.category) params.append("category", filters.category);
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.limit) params.append("limit", String(filters.limit));

      const queryString = params.toString();
      const url = `${METADATA_API_ROUTES.TEMPLATES}${
        queryString ? `?${queryString}` : ""
      }`;

      const response =
        await axiosCallerWithToken.get<MetadataTemplatesListResponse>(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a metadata template
export const useCreateMetadataTemplate = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    MetadataTemplate,
    AxiosError,
    CreateMetadataTemplateApiRequest
  >({
    endpoint: METADATA_API_ROUTES.TEMPLATES,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates"],
  });

  const createTemplate = async (
    templateData: CreateMetadataTemplateApiRequest
  ) => {
    return await callApi(templateData);
  };

  return {
    createTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting a specific metadata template
export const useGetMetadataTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ["metadata-templates", templateId],
    queryFn: async () => {
      if (!templateId) return null;
      
      const { axiosCallerWithToken } = await import("@/lib/helpers");
      const response = await axiosCallerWithToken.get<MetadataTemplateResponse>(
        `${METADATA_API_ROUTES.TEMPLATES}/${templateId}`
      );
      return response.data.data; // Extract the template data from the API response
    },
    enabled: !!templateId, // Only run query when templateId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for updating a metadata template
export const useUpdateMetadataTemplate = (templateId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    MetadataTemplate,
    AxiosError,
    UpdateMetadataTemplateRequest
  >({
    endpoint: `${METADATA_API_ROUTES.TEMPLATES}/${templateId}`,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates", templateId],
  });

  const updateTemplate = async (
    templateData: UpdateMetadataTemplateRequest
  ) => {
    return await callApi(templateData);
  };

  return {
    updateTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for partially updating a metadata template
export const usePartialUpdateMetadataTemplate = (templateId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    MetadataTemplate,
    AxiosError,
    Partial<UpdateMetadataTemplateRequest>
  >({
    endpoint: `${METADATA_API_ROUTES.TEMPLATES}/${templateId}`,
    method: "PATCH",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates", templateId],
  });

  const partialUpdateTemplate = async (
    templateData: Partial<UpdateMetadataTemplateRequest>
  ) => {
    return await callApi(templateData);
  };

  return {
    partialUpdateTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for deleting a metadata template
export const useDeleteMetadataTemplate = (templateId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    { status: boolean; message: string },
    AxiosError
  >({
    endpoint: `${METADATA_API_ROUTES.TEMPLATES}/${templateId}`,
    method: "DELETE",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates", templateId],
  });

  const deleteTemplate = async () => {
    return await callApi();
  };

  return {
    deleteTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for activating a metadata template
export const useActivateMetadataTemplate = (templateId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    MetadataTemplate,
    AxiosError
  >({
    endpoint: `${METADATA_API_ROUTES.TEMPLATES}/${templateId}/activate`,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates", templateId],
  });

  const activateTemplate = async () => {
    return await callApi();
  };

  return {
    activateTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for deactivating a metadata template
export const useDeactivateMetadataTemplate = (templateId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    MetadataTemplate,
    AxiosError
  >({
    endpoint: `${METADATA_API_ROUTES.TEMPLATES}/${templateId}/deactivate`,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["metadata-templates", templateId],
  });

  const deactivateTemplate = async () => {
    return await callApi();
  };

  return {
    deactivateTemplate,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

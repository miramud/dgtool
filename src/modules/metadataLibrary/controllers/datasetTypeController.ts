import { DATASET_TYPE_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  DatasetType,
  CreateDatasetTypeRequest,
  DatasetTypeApiResponse,
} from "../types/datasetType";

export interface DatasetTypeFilters {
  search?: string;
  is_archived?: boolean;
  page?: number;
  page_size?: number;
}

export interface UpdateDatasetTypeRequest {
  name: string;
  description: string;
  status: boolean;
}

export interface DatasetTypeResponse {
  status: boolean;
  message: string;
  data: DatasetType;
}

// Hook for listing all dataset types
export const useGetDatasetTypes = (filters?: DatasetTypeFilters) => {
  return useQuery({
    queryKey: ["dataset-types", filters],
    queryFn: async () => {
      const { axiosCallerWithToken } = await import("@/lib/helpers");

      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.is_archived !== undefined)
        params.append("is_archived", String(filters.is_archived));
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.page_size)
        params.append("page_size", String(filters.page_size));

      const queryString = params.toString();
      const url = `${DATASET_TYPE_ROUTES.LIST}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await axiosCallerWithToken.get<DatasetTypeApiResponse>(
        url
      );
      return response.data;
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: false, // Prevent refetch on window focus
    // refetchOnMount: false, // Prevent refetch on component mount if data exists
  });
};

// Hook for creating a dataset type
export const useCreateDatasetType = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError,
    CreateDatasetTypeRequest
  >({
    endpoint: DATASET_TYPE_ROUTES.CREATE,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types"],
  });

  const createDatasetType = async (
    datasetTypeData: CreateDatasetTypeRequest
  ) => {
    return await callApi(datasetTypeData);
  };

  return {
    createDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting a specific dataset type
export const useGetDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError
  >({
    endpoint: DATASET_TYPE_ROUTES.GET_BY_ID(datasetTypeId),
    method: "GET",
    isAuth: true,
    showSuccessToast: false,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const getDatasetType = async () => {
    return await callApi();
  };

  return {
    getDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for updating a dataset type
export const useUpdateDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError,
    UpdateDatasetTypeRequest
  >({
    endpoint: DATASET_TYPE_ROUTES.UPDATE(datasetTypeId),
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const updateDatasetType = async (
    datasetTypeData: UpdateDatasetTypeRequest
  ) => {
    return await callApi(datasetTypeData);
  };

  return {
    updateDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for partially updating a dataset type
export const usePartialUpdateDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError,
    Partial<UpdateDatasetTypeRequest>
  >({
    endpoint: DATASET_TYPE_ROUTES.PARTIAL_UPDATE(datasetTypeId),
    method: "PATCH",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const partialUpdateDatasetType = async (
    datasetTypeData: Partial<UpdateDatasetTypeRequest>
  ) => {
    return await callApi(datasetTypeData);
  };

  return {
    partialUpdateDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for deleting a dataset type
export const useDeleteDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    { status: boolean; message: string },
    AxiosError
  >({
    endpoint: DATASET_TYPE_ROUTES.DELETE(datasetTypeId),
    method: "DELETE",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const deleteDatasetType = async () => {
    return await callApi();
  };

  return {
    deleteDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for archiving a dataset type
export const useArchiveDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError
  >({
    endpoint: DATASET_TYPE_ROUTES.ARCHIVE(datasetTypeId),
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const archiveDatasetType = async () => {
    return await callApi();
  };

  return {
    archiveDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for unarchiving a dataset type
export const useUnarchiveDatasetType = (datasetTypeId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DatasetType,
    AxiosError
  >({
    endpoint: DATASET_TYPE_ROUTES.UNARCHIVE(datasetTypeId),
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataset-types", datasetTypeId],
  });

  const unarchiveDatasetType = async () => {
    return await callApi();
  };

  return {
    unarchiveDatasetType,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

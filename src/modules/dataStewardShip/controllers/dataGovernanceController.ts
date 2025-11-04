import { DATA_GOVERNANCE_API_ROUTES } from "@/constants/dataGovernance-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCallerWithToken } from "@/lib/helpers";
import { AxiosError } from "axios";
import {
  DataGovernor,
  // DataGovernanceResponse,
  CreateDataGovernorFormData,
  UpdateDataGovernorFormData,
  // UpdateStewardsFormData,
} from "../types/dataGovernance";

export const useCreateDataGovernor = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DataGovernor,
    AxiosError,
    CreateDataGovernorFormData
  >({
    endpoint: DATA_GOVERNANCE_API_ROUTES.GOVERNANCE,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataGovernors"],
  });

  const createDataGovernor = async (formData: CreateDataGovernorFormData) => {
    return await callApi(formData);
  };

  return {
    createDataGovernor,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useUpdateDataGovernor = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DataGovernor,
    AxiosError,
    UpdateDataGovernorFormData & { id: string }
  >({
    endpoint: DATA_GOVERNANCE_API_ROUTES.GOVERNANCE_BY_ID,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataGovernors"],
  });

  const updateDataGovernor = async (
    id: string,
    formData: UpdateDataGovernorFormData
  ) => {
    return await callApi({ ...formData, id });
  };

  return {
    updateDataGovernor,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const usePartialUpdateDataGovernor = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    DataGovernor,
    AxiosError,
    Partial<UpdateDataGovernorFormData> & { id: string }
  >({
    endpoint: DATA_GOVERNANCE_API_ROUTES.GOVERNANCE_BY_ID,
    method: "PATCH",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["dataGovernors"],
  });

  const partialUpdateDataGovernor = async (
    id: string,
    formData: Partial<UpdateDataGovernorFormData>
  ) => {
    return await callApi({ ...formData, id });
  };

  return {
    partialUpdateDataGovernor,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useDeleteDataGovernor = () => {
  const queryClient = useQueryClient();

  const deleteDataGovernor = async (id: string) => {
    const endpoint = DATA_GOVERNANCE_API_ROUTES.GOVERNANCE_BY_ID.replace(
      "{id}",
      id
    );
    const response = await axiosCallerWithToken.delete(endpoint);
    return response.data;
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: deleteDataGovernor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataGovernors"] });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
    },
  });

  return {
    deleteDataGovernor: mutateAsync,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
};

export const useGetDataGovernors = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["dataGovernors", page, limit, search],
    queryFn: async () => {
      let url = DATA_GOVERNANCE_API_ROUTES.GOVERNANCE;
      const params = new URLSearchParams();

      if (page !== 1) params.append("page", page.toString());
      if (limit !== 10) params.append("limit", limit.toString());
      if (search) params.append("search", search);

      if (params.toString()) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url += `?${params.toString()}`;
      }

      const response = await axiosCallerWithToken.get(url);
      return (
        response.data.data?.results ||
        response.data.results ||
        response.data.data ||
        response.data
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useGetDataGovernorById = (id: string) => {
  return useQuery({
    queryKey: ["dataGovernor", id],
    queryFn: async () => {
      const endpoint = DATA_GOVERNANCE_API_ROUTES.GOVERNANCE_BY_ID.replace(
        "{id}",
        id
      );
      const response = await axiosCallerWithToken.get(endpoint);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useGetDataGovernorByDatasetId = (datasetId: string) => {
  return useQuery({
    queryKey: ["dataGovernor", "dataset", datasetId],
    queryFn: async () => {
      const url = `${DATA_GOVERNANCE_API_ROUTES.GOVERNANCE}?dataset_id=${datasetId}`;
      const response = await axiosCallerWithToken.get(url);
      const results =
        response.data.data?.results ||
        response.data.results ||
        response.data.data ||
        response.data;
      return Array.isArray(results) ? results[0] : results;
    },
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useUpdateDatasetStewards = () => {
  const queryClient = useQueryClient();

  const updateStewards = async ({
    datasetId,
    stewards,
  }: {
    datasetId: string;
    stewards: any[];
  }) => {
    const endpoint = DATA_GOVERNANCE_API_ROUTES.GOVERNANCE_BY_ID.replace(
      "{id}",
      datasetId
    );
    const response = await axiosCallerWithToken.patch(endpoint, stewards);
    return response.data;
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: updateStewards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataGovernors"] });
      queryClient.invalidateQueries({ queryKey: ["dataGovernor"] });
    },
    onError: (error: any) => {
      console.error("Update stewards error:", error);
    },
  });

  return {
    updateStewards: mutateAsync,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
};

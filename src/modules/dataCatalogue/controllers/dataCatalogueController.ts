import { DATA_CATALOGUE_API_ROUTES } from "@/constants/dataCatalogue-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DataCatalogue, DataCatalogueFormData } from "../types/dataCatalogue";

export interface DataCatalogueResponse {
    dataCatalogue: DataCatalogue[];
    total: number;
    page: number;
    limit: number;
}

export const useCreateDataCatalogue = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<DataCatalogue, AxiosError, DataCatalogueFormData>({
            endpoint: DATA_CATALOGUE_API_ROUTES.CREATE_DATA_CATALOGUE,
            method: "POST",
            isAuth: true,
            showSuccessToast: true,
            queryKey: ["dataCatalogue"],
        });

    const createDataCatalogue = async (formData: DataCatalogueFormData) => {
        return await callApi(formData);
    };

    return {
        createDataCatalogue,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

export const useUpdateDataCatalogue = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<DataCatalogue, AxiosError, DataCatalogueFormData & { id: string }>({
            endpoint: DATA_CATALOGUE_API_ROUTES.UPDATE_DATA_CATALOGUE,
            method: "PUT",
            isAuth: true,
            showSuccessToast: true,
            queryKey: ["dataCatalogue"],
        });

    const updateDataCatalogue = async (id: string, formData: DataCatalogueFormData) => {
        return await callApi({ ...formData, id });
    };

    return {
        updateDataCatalogue,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

export const useDeleteDataCatalogue = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<{ message: string }, AxiosError, { id: string }>({
            endpoint: DATA_CATALOGUE_API_ROUTES.DELETE_DATA_CATALOGUE,
            method: "DELETE",
            isAuth: true,
            showSuccessToast: true,
            queryKey: ["dataCatalogue"],
        });

    const deleteDataCatalogue = async (id: string) => {
        return await callApi({ id });
    };

    return {
        deleteDataCatalogue,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

export const useGetDataCatalogue = (page = 1, limit = 10, search = "") => {
    return useQuery({
        queryKey: ["dataCatalogue", page, limit, search],
        queryFn: async () => {
            // For now, return mock data
            // In production, this would make an API call
            const mockDataCatalogue = await import("../data/mockDataCatalogue");
            return {
                dataCatalogue: mockDataCatalogue.mockDataCatalogue,
                total: mockDataCatalogue.mockDataCatalogue.length,
                page: 1,
                limit: 10,
            } as DataCatalogueResponse;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
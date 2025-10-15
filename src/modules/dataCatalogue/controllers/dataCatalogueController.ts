import { DATA_CATALOGUE_API_ROUTES } from "@/constants/dataCatalogue-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosCallerWithToken } from "@/lib/helpers";
import { AxiosError } from "axios";
import { DataCatalogue, DataCatalogueFormData } from "../types/dataCatalogue";

export interface DataCatalogueResponse {
    dataCatalogue: DataCatalogue[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateDatasetFormData {
    name: string;
    description: string;
    business_domain: string;
    sensitivity: "INTERNAL" | "EXTERNAL" | "PRIVATE";
    tags: string;
    raw_file: File;
    dataset_type: string;
    metadata_template?: string;
}

export const useCreateDataCatalogue = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<DataCatalogue, AxiosError, FormData>({
            endpoint: DATA_CATALOGUE_API_ROUTES.DATASETS,
            method: "POST",
            isAuth: true,
            showSuccessToast: true,
            contentType: "multipart/form-data",
            queryKey: ["dataCatalogue"],
        });

    const createDataCatalogue = async (formData: CreateDatasetFormData) => {
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('business_domain', formData.business_domain);
        submitData.append('sensitivity', formData.sensitivity);
        
        // Convert comma-separated tags to JSON array
        const tagsArray = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        submitData.append('tags', JSON.stringify(tagsArray));
        
        submitData.append('raw_file', formData.raw_file);
        submitData.append('dataset_type', formData.dataset_type);
        
        // Only append metadata_template if it exists
        if (formData.metadata_template) {
            submitData.append('metadata_template', formData.metadata_template);
        }
        
        return await callApi(submitData);
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
            endpoint: DATA_CATALOGUE_API_ROUTES.DATASET_BY_ID,
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
    const deleteDataCatalogue = async (id: string) => {
        const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_BY_ID.replace('{id}', id);
        const response = await axiosCallerWithToken.delete(endpoint);
        return response.data;
    };

    const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: deleteDataCatalogue,
        onSuccess: () => {
            // You can add success toast here if needed
        },
        onError: (error: any) => {
            console.error('Delete error:', error);
        }
    });

    return {
        deleteDataCatalogue: mutateAsync,
        isLoading: isPending,
        isSuccess,
        isError,
        error,
    };
};

export const useGetDataCatalogue = () => {
    return useQuery({
        queryKey: ["dataCatalogue"],
        queryFn: async () => {
            const response = await axiosCallerWithToken.get(DATA_CATALOGUE_API_ROUTES.DATASETS);
            return response.data.data?.results || response.data.results || response.data.data || response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

export const useGetDataCatalogueById = (id: string) => {
    return useQuery({
        queryKey: ["dataCatalogue", id],
        queryFn: async () => {
            const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_BY_ID.replace('{id}', id);
            const response = await axiosCallerWithToken.get(endpoint);
            return response.data.data;
        },
        enabled: !!id, // Only fetch when id is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};


export interface DatasetType {
    id: string;
    name: string;
    description?: string;
}

export interface MetadataTemplate {
    id: string;
    name: string;
    description?: string;
}

export const useGetDatasetTypes = () => {
    return useQuery({
        queryKey: ["datasetTypes"],
        queryFn: async () => {
            const response = await axiosCallerWithToken.get(DATA_CATALOGUE_API_ROUTES.DATASET_TYPES);
            return response.data.data?.results || response.data.results || response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

export const useGetMetadataTemplates = (datasetTypeId?: string) => {
    return useQuery({
        queryKey: ["metadataTemplates", datasetTypeId],
        queryFn: async () => {
            let url: string = DATA_CATALOGUE_API_ROUTES.TEMPLATES;
            if (datasetTypeId) {
                url = `${url}?dataset_type=${datasetTypeId}`;
            }
            const response = await axiosCallerWithToken.get(url);
            return response.data.data?.results || response.data.results || response.data;
        },
        enabled: !!datasetTypeId, // Only fetch when dataset type is selected
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

export interface Inconsistency {
    id: string;
    cleanup_session_reference: string;
    created_datetime: string;
    updated_datetime: string;
    row_number: number;
    column_name: string;
    field_name: string;
    inconsistency_type: string;
    severity: string;
    original_value: string;
    cleaned_value: string | null;
    expected_type: string;
    error_message: string;
    action_taken: string;
    is_resolved: boolean;
    validation_rule: string;
    additional_context: string | null;
    cleanup_session: string;
}

export interface CleanupSession {
    id: string;
    created_by: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
    } | null;
    updated_by: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
    } | null;
    dataset_name: string;
    dataset_reference: string;
    success_rate: number;
    inconsistencies: Inconsistency[];
    created_datetime: string;
    updated_datetime: string;
    session_reference: string;
    total_rows_processed: number;
    total_rows_cleaned: number;
    total_rows_rejected: number;
    total_inconsistencies: number;
    status: string;
    started_datetime: string;
    completed_datetime: string;
    error_message: string | null;
    metadata_template_snapshot: any;
    cleanup_summary: any;
    rejected_rows: any[];
    dataset: string;
}

export const useGetDatasetCleanupSession = (id: string) => {
    return useQuery({
        queryKey: ["datasetCleanupSession", id],
        queryFn: async () => {
            const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_CLEANUP_SESSION.replace('{id}', id);
            const response = await axiosCallerWithToken.get(endpoint);
            return response.data.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};
import { DATA_CATALOGUE_API_ROUTES } from "@/constants/dataCatalogue-api-routes";
import { ISSUE_ROUTES } from "@/constants/issue-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosCallerWithToken } from "@/lib/helpers";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { DataCatalogue, DataCatalogueFormData } from "../types/dataCatalogue";
import { IssueListResponse, IssueStatus } from "../types/issue";

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
    raw_file?: File;
    dataset_type?: string;
    metadata_template?: string;
    db_connection_info?: {
        host: string;
        port: number;
        username: string;
        password: string;
        database_name: string;
        table_name: string;
        schema: string;
        db_type: "postgresql" | "mysql";
        ssl_mode: "disable" | "allow" | "prefer" | "require" | "verify-ca" | "verify-full";
    };
}

const serializeTags = (tags: string): string => {
    const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    return JSON.stringify(parsedTags);
};

const getApiErrorMessage = (error: any): string => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
};

export const useCreateDataCatalogue = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<DataCatalogue, AxiosError, FormData | Record<string, any>>({
            endpoint: DATA_CATALOGUE_API_ROUTES.DATASETS,
            method: "POST",
            isAuth: true,
            showSuccessToast: true,
            queryKey: ["dataCatalogue"],
        });

    const createDataCatalogue = async (formData: CreateDatasetFormData) => {
        if (formData.db_connection_info) {
            const submitData: Record<string, any> = {
                name: formData.name,
                description: formData.description,
                business_domain: formData.business_domain,
                sensitivity: formData.sensitivity,
                tags: serializeTags(formData.tags),
                raw_file: null,
                db_connection_info: formData.db_connection_info,
            };

            if (formData.metadata_template) {
                submitData.metadata_template = formData.metadata_template;
            }

            return await callApi(submitData);
        }

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("business_domain", formData.business_domain);
        submitData.append("sensitivity", formData.sensitivity);
        submitData.append("tags", serializeTags(formData.tags));

        if (formData.raw_file) {
            submitData.append("raw_file", formData.raw_file);
        }

        if (formData.metadata_template) {
            submitData.append("metadata_template", formData.metadata_template);
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

export const useAppendDataset = () => {
    const appendDataset = async (datasetId: string, formData: CreateDatasetFormData) => {
        const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_APPEND_BY_ID.replace("{id}", datasetId);

        if (formData.db_connection_info) {
            const submitData: Record<string, any> = {
                name: formData.name,
                description: formData.description,
                business_domain: formData.business_domain,
                sensitivity: formData.sensitivity,
                tags: serializeTags(formData.tags),
                raw_file: null,
                db_connection_info: formData.db_connection_info,
            };

            if (formData.metadata_template) {
                submitData.metadata_template = formData.metadata_template;
            }

            const response = await axiosCallerWithToken.post(endpoint, submitData);
            return response.data;
        }

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("business_domain", formData.business_domain);
        submitData.append("sensitivity", formData.sensitivity);
        submitData.append("tags", serializeTags(formData.tags));

        if (formData.raw_file) {
            submitData.append("raw_file", formData.raw_file);
        }

        if (formData.metadata_template) {
            submitData.append("metadata_template", formData.metadata_template);
        }

        const response = await axiosCallerWithToken.post(endpoint, submitData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    };

    const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: ({ datasetId, formData }: { datasetId: string; formData: CreateDatasetFormData }) =>
            appendDataset(datasetId, formData),
        onSuccess: (response: any) => {
            toast.success(response?.message || "Dataset append request submitted successfully.");
        },
        onError: (error: any) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    return {
        appendDataset: mutateAsync,
        isLoading: isPending,
        isSuccess,
        isError,
        error,
    };
};

export interface EditDatasetRowPayload {
    row_index: number;
    data: Record<string, string>;
}

export const useEditDatasetRow = () => {
    const editDatasetRow = async (datasetId: string, payload: EditDatasetRowPayload) => {
        const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_EDIT_ROW_BY_ID.replace("{id}", datasetId);
        const response = await axiosCallerWithToken.patch(endpoint, payload);
        return response.data;
    };

    const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: ({ datasetId, payload }: { datasetId: string; payload: EditDatasetRowPayload }) =>
            editDatasetRow(datasetId, payload),
        onError: (error: any) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    return {
        editDatasetRow: mutateAsync,
        isLoading: isPending,
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

export const useGetDatasetProcessedData = (id: string) => {
    return useQuery({
        queryKey: ["datasetProcessedData", id],
        queryFn: async () => {
            const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_PROCESSED_DATA.replace("{id}", id);
            const response = await axiosCallerWithToken.get(endpoint, {
                params: {
                    format: "json",
                },
            });
            return response.data;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
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

export interface DuplicateRecord {
    id: string;
    cleanup_session_reference: string;
    dataset_name: string;
    dataset_reference: string;
    created_datetime: string;
    updated_datetime: string;
    row_number: number;
    duplicate_group_hash: string;
    unique_together_fields: string[] | string;
    field_values: Record<string, any> | string;
    row_data: Record<string, any> | string;
    duplicate_count: number;
    is_first_occurrence: boolean;
    cleanup_session: string;
}

export interface DuplicateRecordsResponse {
    status: boolean;
    message: string;
    data: DuplicateRecord[];
}

export const useGetDatasetDuplicateRecords = (id: string) => {
    return useQuery({
        queryKey: ["datasetDuplicateRecords", id],
        queryFn: async () => {
            const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_DUPLICATE_RECORDS.replace('{id}', id);
            const response = await axiosCallerWithToken.get(endpoint);
            return response.data as DuplicateRecordsResponse;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

export interface DuplicateGroupResponse {
    status: boolean;
    message: string;
    data: {
        duplicate_group_hash: string;
        unique_together_fields: string[];
        field_values: string;
        duplicate_count: number;
        duplicate_records: {
            id: string;
            row_number: number;
            is_first_occurrence: boolean;
            row_data: string;
            created_datetime: string;
        }[];
    };
}

export const useGetDuplicateRecordsByGroup = (datasetId: string, groupHash: string) => {
    return useQuery({
        queryKey: ["duplicateRecordsByGroup", datasetId, groupHash],
        queryFn: async () => {
            const endpoint = DATA_CATALOGUE_API_ROUTES.DATASET_DUPLICATE_RECORDS_BY_GROUP
                .replace('{id}', datasetId)
                .replace('{group_hash}', groupHash);
            const response = await axiosCallerWithToken.get(endpoint);
            return response.data as DuplicateGroupResponse;
        },
        enabled: !!datasetId && !!groupHash,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

// Issue-related hooks
export const useGetIssuesByDataset = (datasetId: string) => {
    return useQuery({
        queryKey: ["issues", "dataset", datasetId],
        queryFn: async () => {
            const url = `${ISSUE_ROUTES.LIST}?dataset=${datasetId}`;
            const response = await axiosCallerWithToken.get(url);
            return response.data.data as IssueListResponse;
        },
        enabled: !!datasetId,
        staleTime: 2 * 60 * 1000, // 2 minutes for fresher issue data
        retry: 1,
    });
};

export const useGetOpenIssueCount = (datasetId: string) => {
    return useQuery({
        queryKey: ["issues", "openCount", datasetId],
        queryFn: async () => {
            // Fetch only open and in-progress issues for this dataset
            const url = `${ISSUE_ROUTES.LIST}?dataset=${datasetId}`;
            const response = await axiosCallerWithToken.get(url);
            const data = response.data.data as IssueListResponse;

            // Count only OPEN and IN_PROGRESS issues
            const openCount = data.results.filter(
                (issue) => issue.status === IssueStatus.OPEN || issue.status === IssueStatus.IN_PROGRESS
            ).length;

            return openCount;
        },
        enabled: !!datasetId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 1,
    });
};

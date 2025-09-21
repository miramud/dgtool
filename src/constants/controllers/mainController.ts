import { axiosCaller, axiosCallerWithToken } from "@/lib/helpers";
import {
    useMutation,
    useQueryClient,
    UseMutationResult,
} from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "sonner";

interface ApiResponse<TData = unknown> {
    status: boolean;
    message: string;
    data: TData;
}

interface ApiManagerOptions<TData, TError> {
    endpoint: string;
    queryKey?: string | string[];
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    isAuth?: boolean;
    showSuccessToast?: boolean;
    contentType?: string | null;
    onSuccess?: (response: ApiResponse<TData>) => void;
    onError?: (error: TError) => void;
}

interface ApiManagerReturn<TData, TError, TVariables> {
    callApi: (details: TVariables) => Promise<ApiResponse<TData>>;
    data: TData | undefined;
    response: ApiResponse<TData> | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    error: TError | null;
    isError: boolean;
    mutation: UseMutationResult<ApiResponse<TData>, TError, TVariables>;
}

const useApiManager = <TData = unknown, TError = Error, TVariables = unknown>({
    endpoint,
    queryKey,
    method = "POST",
    isAuth = false,
    showSuccessToast = true,
}: ApiManagerOptions<TData, TError>): ApiManagerReturn<
    TData,
    TError,
    TVariables
> => {
    const queryClient = useQueryClient();

    const axiosInstance: AxiosInstance = isAuth
        ? axiosCallerWithToken
        : axiosCaller;

    const apiController = async (
        details: TVariables
    ): Promise<ApiResponse<TData>> => {
        try {
            let response: AxiosResponse<ApiResponse<TData>>;
            const config = {};

            switch (method.toUpperCase()) {
                case "POST":
                    response = await axiosInstance.post(
                        endpoint,
                        details,
                        config
                    );
                    break;
                case "PUT":
                    response = await axiosInstance.put(
                        endpoint,
                        details,
                        config
                    );
                    break;
                case "PATCH":
                    response = await axiosInstance.patch(
                        endpoint,
                        details,
                        config
                    );
                    break;
                case "DELETE":
                    response = await axiosInstance.delete(endpoint, {
                        ...config,
                        data: details,
                    });
                    break;

                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            // @ts-expect untyped error message
            toast.error(axiosError?.response?.data?.message);

            throw new Error(
                axiosError.response?.data?.message ||
                    "An unexpected error occurred"
            ) as TError;
        }
    };

    const mutation = useMutation<ApiResponse<TData>, TError, TVariables>({
        mutationFn: apiController,
        onSuccess: (response) => {
            if (showSuccessToast && response?.message) {
            }

            if (queryKey) {
                const updateQueryKeys = Array.isArray(queryKey)
                    ? queryKey
                    : [queryKey];
                updateQueryKeys.forEach((key) => {
                    if (key) queryClient.invalidateQueries({ queryKey: [key] });
                });
            }
        },
        onError: (error: TError) => {
            console.error(`${method} error:`, error);
        },
    });

    const callApi = async (
        details: TVariables
    ): Promise<ApiResponse<TData>> => {
        return await mutation.mutateAsync(details);
    };

    return {
        callApi,
        data: mutation.data?.data,
        response: mutation.data,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
        isError: mutation.isError,
        mutation,
    };
};

export default useApiManager;

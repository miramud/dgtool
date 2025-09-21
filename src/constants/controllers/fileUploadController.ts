import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";

export type FileUploadResponse = {
    url: string;
    public_id: string;
};

type FileUploadPayload = FormData;

const useFileUploadController = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<FileUploadResponse, AxiosError, FileUploadPayload>({
            endpoint: "/files/upload",
            method: "POST",
            isAuth: false,
            showSuccessToast: true,
            contentType: "multipart/form-data",
            queryKey: ["FileUpload"],
        });

    const uploadFile = async (
        formData: FormData
    ): Promise<FileUploadResponse> => {
        const response = await callApi(formData);
        return response.data;
    };

    return {
        uploadFile,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

export default useFileUploadController;

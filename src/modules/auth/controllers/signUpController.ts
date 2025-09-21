import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ISignUpResponse, TSignUpFormValues } from "../lib/types";

export const useSignUp = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<ISignUpResponse, AxiosError, TSignUpFormValues>({
            endpoint: AUTH_API_ROUTES.REGISTER_USER,
            method: "POST",
            isAuth: false,
            showSuccessToast: true,
            queryKey: ["user"],
        });

    const signUp = async (formData: TSignUpFormValues) => {
        return await callApi(formData);
    };

    return {
        signUp,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

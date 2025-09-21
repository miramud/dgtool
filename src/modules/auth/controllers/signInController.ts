import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ISignUpResponse, TSignInFormValues } from "../lib/types";

export const useSignIn = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<ISignUpResponse, AxiosError, TSignInFormValues>({
            endpoint: AUTH_API_ROUTES.LOGIN,
            method: "POST",
            isAuth: false,
            showSuccessToast: true,
            queryKey: ["user"],
        });

    const signIn = async (formData: TSignInFormValues) => {
        return await callApi(formData);
    };

    return {
        signIn,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

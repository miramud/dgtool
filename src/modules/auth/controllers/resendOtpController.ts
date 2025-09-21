import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ISignUpResponse } from "../lib/types";

export const useResendOtp = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<ISignUpResponse, AxiosError, { email: string }>({
            endpoint: AUTH_API_ROUTES.RESEND_OTP,
            method: "POST",
            isAuth: false,
            showSuccessToast: true,
            queryKey: ["user"],
        });

    const resendOtp = async (formData: { email: string }) => {
        return await callApi(formData);
    };

    return {
        resendOtp,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
    };
};

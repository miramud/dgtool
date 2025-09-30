import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ISignUpResponse, TVerifyEmailFormValues } from "../lib/types";

export const useVerifyEmail = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    ISignUpResponse,
    AxiosError,
    TVerifyEmailFormValues
  >({
    endpoint: AUTH_API_ROUTES.VERIFY_NEW_USER,
    method: "POST",
    isAuth: false,
    showSuccessToast: true,
    queryKey: ["user"],
  });

  const verifyEmail = async (formData: TVerifyEmailFormValues) => {
    return await callApi(formData);
  };

  return {
    verifyEmail,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

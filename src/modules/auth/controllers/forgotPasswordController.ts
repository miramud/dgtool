import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { TForgotPasswordFormValues } from "../lib/types";

export const useForgotPassword = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    any,
    AxiosError,
    TForgotPasswordFormValues
  >({
    endpoint: AUTH_API_ROUTES.PASSWORD_RESET_INITIATE,
    method: "POST",
    isAuth: false,
    showSuccessToast: true,
    queryKey: ["user"],
  });

  const forgotPassword = async (formData: TForgotPasswordFormValues) => {
    return await callApi(formData);
  };

  return {
    forgotPassword,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

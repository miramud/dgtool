import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { TResetPasswordFormValues } from "../lib/types";

export const useResetPassword = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    any,
    AxiosError,
    Partial<TResetPasswordFormValues>
  >({
    endpoint: AUTH_API_ROUTES.RESET_PASSWORD,
    method: "POST",
    isAuth: false,
    showSuccessToast: true,
    queryKey: ["user"],
  });

  const resetPassword = async (formData: Partial<TResetPasswordFormValues>) => {
    return await callApi(formData);
  };

  return {
    resetPassword,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useFirstResetPassword = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    any,
    AxiosError,
    Partial<TResetPasswordFormValues>
  >({
    endpoint: AUTH_API_ROUTES.NEW_PASSWORD_RESET,
    method: "POST",
    isAuth: false,
    showSuccessToast: true,
    queryKey: ["user"],
  });

  const firstResetPassword = async (
    formData: Partial<TResetPasswordFormValues>
  ) => {
    return await callApi(formData);
  };

  return {
    firstResetPassword,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

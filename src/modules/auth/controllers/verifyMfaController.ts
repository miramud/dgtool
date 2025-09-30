import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ILoginData, TVerifyEmailFormValues } from "../lib/types";

export const useVerifyMfa = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    ILoginData,
    AxiosError,
    TVerifyEmailFormValues
  >({
    endpoint: AUTH_API_ROUTES.VERIFY_MFA,
    method: "POST",
    isAuth: false,
    showSuccessToast: true,
    queryKey: ["mfa-verification"],
  });

  const verifyMfa = async (formData: TVerifyEmailFormValues) => {
    return await callApi(formData);
  };

  return {
    verifyMfa,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

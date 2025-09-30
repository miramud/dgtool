import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { ILoginData, TSignInFormValues } from "../lib/types";

export const useSignIn = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    ILoginData,
    AxiosError,
    TSignInFormValues
  >({
    endpoint: AUTH_API_ROUTES.LOGIN,
    method: "POST",
    isAuth: false,
    showSuccessToast: false,
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

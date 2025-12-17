import { USER_API_ROUTES } from "@/constants/user-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  UserProfile,
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from "../types/user";

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: UserProfile;
}

// Hook for getting user profile
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { axiosCallerWithToken } = await import("@/lib/helpers");
      const response = await axiosCallerWithToken.get<UserProfile>(
        USER_API_ROUTES.GET_USER_PROFILE
      );
      // API returns the profile directly, not wrapped
      return response.data;
    },
  });
};

// Hook for updating user profile
export const useUpdateUserProfile = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    UserProfile,
    AxiosError,
    UpdateProfileRequest | FormData
  >({
    endpoint: USER_API_ROUTES.UPDATE_USER_PROFILE,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["user-profile"],
  });

  const updateProfile = async (profileData: UpdateProfileRequest | FormData) => {
    return await callApi(profileData);
  };

  return {
    updateProfile,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for updating user password
export const useUpdateUserPassword = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    void,
    AxiosError,
    UpdatePasswordRequest
  >({
    endpoint: USER_API_ROUTES.UPDATE_USER_PASSWORD,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
  });

  const updatePassword = async (passwordData: UpdatePasswordRequest) => {
    return await callApi(passwordData);
  };

  return {
    updatePassword,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

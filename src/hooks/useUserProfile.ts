import { useQuery } from "@tanstack/react-query";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import { USER_API_ROUTES } from "@/constants/user-api-routes";
import {
    UserProfile,
    UpdateProfileRequest,
    UpdatePasswordRequest,
} from "@/modules/userManagement/types/user";

export interface UserProfileResponse {
    status: boolean;
    message: string;
    data: UserProfile;
}

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { axiosCallerWithToken } = await import("@/lib/helpers");
            const response = await axiosCallerWithToken.get<UserProfile>(
                USER_API_ROUTES.GET_USER_PROFILE
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateUserProfile = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<UserProfile, AxiosError, UpdateProfileRequest>({
            endpoint: USER_API_ROUTES.UPDATE_USER_PROFILE,
            method: "PUT",
            isAuth: true,
            showSuccessToast: true,
            queryKey: ["user-profile"],
        });

    const updateProfile = async (profileData: UpdateProfileRequest) => {
        return await callApi(profileData);
    };

    return {
        updateProfile,
        mutate: updateProfile,
        data,
        isLoading,
        isPending: isLoading,
        isSuccess,
        isError,
        error,
    };
};

export const useUpdateUserPassword = () => {
    const { callApi, data, isLoading, isSuccess, isError, error } =
        useApiManager<void, AxiosError, UpdatePasswordRequest>({
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
        mutate: updatePassword,
        data,
        isLoading,
        isPending: isLoading,
        isSuccess,
        isError,
        error,
    };
};

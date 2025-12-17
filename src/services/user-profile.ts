import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { USER_API_ROUTES } from "@/constants/user-api-routes";
import {
    UserProfile,
    UpdateProfileRequest,
    UpdatePasswordRequest,
} from "@/modules/userManagement/types/user";

export const userProfileService = {
    async getProfile(): Promise<IResponse<UserProfile>> {
        console.log("Calling API endpoint:", USER_API_ROUTES.GET_USER_PROFILE);
        try {
            const response = await apiClient.get<IResponse<UserProfile>>(
                USER_API_ROUTES.GET_USER_PROFILE
            );
            console.log("Service response:", response);
            console.log("Service response.data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Service error:", error);
            throw error;
        }
    },

    async updateProfile(
        data: UpdateProfileRequest
    ): Promise<IResponse<UserProfile>> {
        const response = await apiClient.put<IResponse<UserProfile>>(
            USER_API_ROUTES.UPDATE_USER_PROFILE,
            data
        );
        return response.data;
    },

    async updatePassword(
        data: UpdatePasswordRequest
    ): Promise<IResponse<void>> {
        const response = await apiClient.put<IResponse<void>>(
            USER_API_ROUTES.UPDATE_USER_PASSWORD,
            data
        );
        return response.data;
    },
};

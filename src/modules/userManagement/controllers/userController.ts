import { USER_API_ROUTES } from "@/constants/user-api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User, UserFormData } from "../types/user";
import { IUser } from "@/modules/auth/lib/types";

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export const useCreateUser = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    User,
    AxiosError,
    UserFormData
  >({
    endpoint: USER_API_ROUTES.CREATE_USER,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["users"],
  });

  const createUser = async (formData: UserFormData) => {
    return await callApi(formData);
  };

  return {
    createUser,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useUpdateUser = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    User,
    AxiosError,
    UserFormData & { id: string }
  >({
    endpoint: USER_API_ROUTES.UPDATE_USER,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["users"],
  });

  const updateUser = async (id: string, formData: UserFormData) => {
    return await callApi({ ...formData, id });
  };

  return {
    updateUser,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useDeleteUser = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    { message: string },
    AxiosError,
    { id: string }
  >({
    endpoint: USER_API_ROUTES.DELETE_USER,
    method: "DELETE",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["users"],
  });

  const deleteUser = async (id: string) => {
    return await callApi({ id });
  };

  return {
    deleteUser,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export const useGetUsers = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      // For now, return mock data
      // In production, this would make an API call
      const mockUsers = await import("../data/mockUsers");
      return {
        users: mockUsers.mockUsers,
        total: mockUsers.mockUsers.length,
        page: 1,
        limit: 10,
      } as UsersResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
      if (!token) {
        throw new Error("No access token found");
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${USER_API_ROUTES.GET_USER_PROFILE}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data as IUser;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

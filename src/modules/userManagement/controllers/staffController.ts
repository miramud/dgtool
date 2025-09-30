import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";
import {
  BackendStaff,
  StaffListResponse,
  StaffDetailResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  AssignRolesRequest,
} from "../types/user";

// Hook for listing all staff
export const useGetStaffs = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffListResponse, AxiosError>({
      endpoint: AUTH_API_ROUTES.STAFFS,
      method: "GET",
      isAuth: true,
      showSuccessToast: false,
      queryKey: ["staffs"],
    });

  const getStaffs = async () => {
    return await callApi();
  };

  return {
    getStaffs,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for creating a staff member
export const useCreateStaff = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError, CreateStaffRequest>({
      endpoint: AUTH_API_ROUTES.STAFFS,
      method: "POST",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staffs"],
    });

  const createStaff = async (staffData: CreateStaffRequest) => {
    return await callApi(staffData);
  };

  return {
    createStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting a specific staff member
export const useGetStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}`,
      method: "GET",
      isAuth: true,
      showSuccessToast: false,
      queryKey: ["staff", staffId],
    });

  const getStaff = async () => {
    return await callApi();
  };

  return {
    getStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for updating a staff member
export const useUpdateStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError, UpdateStaffRequest>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}`,
      method: "PUT",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const updateStaff = async (staffData: UpdateStaffRequest) => {
    return await callApi(staffData);
  };

  return {
    updateStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for partially updating a staff member
export const usePartialUpdateStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError, Partial<UpdateStaffRequest>>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}`,
      method: "PATCH",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const partialUpdateStaff = async (staffData: Partial<UpdateStaffRequest>) => {
    return await callApi(staffData);
  };

  return {
    partialUpdateStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for deleting a staff member
export const useDeleteStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<{ status: boolean; message: string }, AxiosError>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}`,
      method: "DELETE",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const deleteStaff = async () => {
    return await callApi();
  };

  return {
    deleteStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for activating a staff member
export const useActivateStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}/activate`,
      method: "PATCH",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const activateStaff = async () => {
    return await callApi();
  };

  return {
    activateStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for suspending a staff member
export const useSuspendStaff = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}/suspend`,
      method: "PATCH",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const suspendStaff = async () => {
    return await callApi();
  };

  return {
    suspendStaff,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for assigning roles to a staff member (PUT)
export const useAssignStaffRoles = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError, AssignRolesRequest>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}/roles`,
      method: "PUT",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const assignRoles = async (roleData: AssignRolesRequest) => {
    return await callApi(roleData);
  };

  return {
    assignRoles,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for partially assigning roles to a staff member (PATCH)
export const usePartialAssignStaffRoles = (staffId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError, AssignRolesRequest>({
      endpoint: `${AUTH_API_ROUTES.STAFFS}/${staffId}/roles`,
      method: "PATCH",
      isAuth: true,
      showSuccessToast: true,
      queryKey: ["staff", staffId],
    });

  const partialAssignRoles = async (roleData: AssignRolesRequest) => {
    return await callApi(roleData);
  };

  return {
    partialAssignRoles,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting staff profile
export const useGetStaffProfile = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } =
    useApiManager<StaffDetailResponse, AxiosError>({
      endpoint: AUTH_API_ROUTES.STAFF_PROFILE,
      method: "GET",
      isAuth: true,
      showSuccessToast: false,
      queryKey: ["staff-profile"],
    });

  const getProfile = async () => {
    return await callApi();
  };

  return {
    getProfile,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};
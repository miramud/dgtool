import { AUTH_API_ROUTES } from "@/constants/api-routes";
import useApiManager from "@/constants/controllers/mainController";
import { AxiosError } from "axios";

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: string[];
  description?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  permissions_count: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface RolesListResponse {
  status: boolean;
  message: string;
  results: RoleResponse[];
}

export interface PermissionsListResponse {
  status: boolean;
  message: string;
  data: PermissionResponse[];
}

export interface RoleDetailResponse {
  status: boolean;
  message: string;
  data: RoleResponse;
}

// Hook for listing all roles
export const useGetRoles = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    RolesListResponse,
    AxiosError
  >({
    endpoint: AUTH_API_ROUTES.ROLES,
    method: "GET",
    isAuth: true,
    showSuccessToast: false,
    queryKey: ["roles"],
  });

  const getRoles = async () => {
    return await callApi();
  };

  return {
    getRoles,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for creating a role
export const useCreateRole = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    RoleDetailResponse,
    AxiosError,
    CreateRoleRequest
  >({
    endpoint: AUTH_API_ROUTES.ROLES,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["roles"],
  });

  const createRole = async (roleData: CreateRoleRequest) => {
    return await callApi(roleData);
  };

  return {
    createRole,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting a specific role
export const useGetRole = (roleId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    RoleDetailResponse,
    AxiosError
  >({
    endpoint: `${AUTH_API_ROUTES.ROLES}/${roleId}`,
    method: "GET",
    isAuth: true,
    showSuccessToast: false,
    queryKey: ["role", roleId],
  });

  const getRole = async () => {
    return await callApi();
  };

  return {
    getRole,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for updating a role
export const useUpdateRole = (roleId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    RoleDetailResponse,
    AxiosError,
    UpdateRoleRequest
  >({
    endpoint: `${AUTH_API_ROUTES.ROLES}/${roleId}`,
    method: "PUT",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["role", roleId],
  });

  const updateRole = async (roleData: UpdateRoleRequest) => {
    return await callApi(roleData);
  };

  return {
    updateRole,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for partially updating a role
export const usePartialUpdateRole = (roleId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    RoleDetailResponse,
    AxiosError,
    Partial<UpdateRoleRequest>
  >({
    endpoint: `${AUTH_API_ROUTES.ROLES}/${roleId}`,
    method: "PATCH",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["role", roleId],
  });

  const partialUpdateRole = async (roleData: Partial<UpdateRoleRequest>) => {
    return await callApi(roleData);
  };

  return {
    partialUpdateRole,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for deleting a role
export const useDeleteRole = (roleId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    { status: boolean; message: string },
    AxiosError
  >({
    endpoint: `${AUTH_API_ROUTES.ROLES}/${roleId}`,
    method: "DELETE",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["role", roleId],
  });

  const deleteRole = async () => {
    return await callApi();
  };

  return {
    deleteRole,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for listing all permissions
export const useGetPermissions = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    PermissionsListResponse,
    AxiosError
  >({
    endpoint: AUTH_API_ROUTES.PERMISSIONS,
    method: "GET",
    isAuth: true,
    showSuccessToast: false,
    queryKey: ["permissions"],
  });

  const getPermissions = async () => {
    return await callApi();
  };

  return {
    getPermissions,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Hook for getting a specific permission
export const useGetPermission = (permissionId: string) => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    { status: boolean; message: string; data: PermissionResponse },
    AxiosError
  >({
    endpoint: `${AUTH_API_ROUTES.PERMISSIONS}/${permissionId}`,
    method: "GET",
    isAuth: true,
    showSuccessToast: false,
    queryKey: ["permission", permissionId],
  });

  const getPermission = async () => {
    return await callApi();
  };

  return {
    getPermission,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  roles: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  roles: string[];
}

export enum UserRole {
  DATA_OWNER = "Data Owner",
  BUSINESS_ANALYST = "Business Analyst",
  DATA_STEWARD = "Data Steward",
  COMPLIANCE_OFFICER = "Compliance Officer",
  ADMIN = "Admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

// Backend Staff response interface
export interface BackendStaff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  is_suspended: boolean;
  last_login?: string;
  date_joined: string;
  roles: Array<{
    id: string;
    name: string;
  }>;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number?: string;
    date_joined: string;
  };
}

// Staff list response
export interface StaffListResponse {
  status: boolean;
  message: string;
  data: BackendStaff[];
}

// Staff detail response
export interface StaffDetailResponse {
  status: boolean;
  message: string;
  data: BackendStaff;
}

// Create/Update staff request
export interface CreateStaffRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

export interface UpdateStaffRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Assign roles request
export interface AssignRolesRequest {
  role_ids: string[];
}

// User profile types
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  is_active: boolean;
  profile_picture?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  profile_picture?: string;
  password?: string;
}

export interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
}

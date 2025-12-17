export enum ActivityType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  PASSWORD_RESET = "PASSWORD_RESET",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  USER_UPDATE = "USER_UPDATE",
  ROLES_ASSIGN = "ROLES_ASSIGN",
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.LOGIN]: "User logged in to the system",
  [ActivityType.LOGOUT]: "User logged out from the system",
  [ActivityType.PASSWORD_RESET]: "User reset their password",
  [ActivityType.PASSWORD_CHANGE]: "User changed their password",
  [ActivityType.USER_UPDATE]: "User profile was updated",
  [ActivityType.ROLES_ASSIGN]: "New role was assigned to user",
};

export interface AuditLogUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  is_active: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface AuditLog {
  id: string;
  user: AuditLogUser;
  created_datetime: string;
  updated_datetime: string;
  activity: ActivityType;
  activity_datetime: string;
  ip_address: string;
  user_agent: string;
  metadata: string;
}

export interface Paginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number: number | null;
  next: string | null;
  previous: string | null;
  previous_page_number: number | null;
}

export interface AuditLogResponse {
  status: boolean;
  message: string;
  data: {
    paginator: Paginator;
    results: AuditLog[];
  };
}

export interface AuditLogFilters {
  search?: string;
  activity?: ActivityType;
  user?: string;
  page?: number;
  size?: number;
  ordering?: string;
}

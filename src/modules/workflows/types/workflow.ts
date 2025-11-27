// Workflow status types
export type WorkflowStatus = "active" | "inactive" | "draft";

// Action types that can be covered by a workflow
export type WorkflowAction =
  | "publish"
  | "edit_metadata"
  | "delete"
  | "assign_steward"
  | "export"
  | "access_grant";

// User info interface
export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number?: string;
}

// Role interface
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  permissions_count?: number;
  created_by?: string;
  created_datetime: string;
  updated_datetime: string;
}

// Dataset Type interface
export interface DatasetType {
  id: string;
  name: string;
  description?: string;
  is_archived: boolean;
  client: string;
  created_by?: UserInfo;
  updated_by?: UserInfo;
  created_datetime: string;
  updated_datetime: string;
  deleted_datetime?: string;
  is_deleted: boolean;
}

// Client interface
export interface Client {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  staff_count: number;
  active_staff_count: number;
  created_by: string;
  updated_by: string;
  created_datetime: string;
  updated_datetime: string;
}

// Staff/Approver detailed interface
export interface ApproverDetail {
  id: string;
  client_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  created_datetime: string;
  updated_datetime: string;
  deleted_datetime?: string;
  is_deleted: boolean;
  is_active: boolean;
  is_admin: boolean;
  can_login: boolean;
  created_by: string;
  updated_by: string;
  roles: string[];
}

// Workflow Approver interface
export interface WorkflowApprover {
  id: string;
  approver: ApproverDetail;
  approval_order: number;
  role: Role;
  created_datetime: string;
  updated_datetime: string;
}

// Main workflow interface (API response for single workflow)
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  dataset_type: DatasetType;
  client: Client;
  workflow_approvers: WorkflowApprover[];
  created_by: UserInfo;
  updated_by: UserInfo;
  created_datetime: string;
  updated_datetime: string;
}

// Workflow list item (API response for list)
export interface WorkflowListItem {
  id: string;
  name: string;
  description?: string;
  dataset_type: string; // ID
  dataset_type_name: string;
  client: string; // ID
  client_name: string;
  approvers_count: string;
  created_by: string; // ID
  created_by_name: string;
  created_datetime: string;
  updated_datetime: string;
}

// Approver for create/update request
export interface ApproverRequest {
  approver: string; // ID
  approval_order: number;
  role: string; // ID
}

// Create workflow request
export interface CreateWorkflowRequest {
  approvers: ApproverRequest[];
  name: string;
  description?: string;
  dataset_type: string; // ID
}

// Update workflow request (same as create)
export interface UpdateWorkflowRequest {
  approvers: ApproverRequest[];
  name: string;
  description?: string;
  dataset_type: string; // ID
}

// Paginator interface
export interface Paginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number?: number;
  next?: string;
  previous?: string;
  previous_page_number?: number;
}

// API response types
export interface WorkflowListResponse {
  paginator: Paginator;
  results: WorkflowListItem[];
}

// Filter options
export interface WorkflowFilters {
  search?: string;
  status?: WorkflowStatus | "all";
  dataset_type?: string;
  assignee?: string;
  page?: number;
  page_size?: number;
}

// Action labels for display
export const WORKFLOW_ACTION_LABELS: Record<WorkflowAction, string> = {
  publish: "Publish",
  edit_metadata: "Edit Metadata",
  delete: "Delete",
  assign_steward: "Assign Steward",
  export: "Export",
  access_grant: "Access Grant",
};

// Status configuration
export const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "text-green-600" },
  inactive: { label: "Inactive", color: "text-red-600" },
  draft: { label: "Draft", color: "text-yellow-600" },
};

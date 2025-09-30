export interface Role {
  id: string;
  roleId: string;
  name: string;
  permissions: string[];
  permissions_count?: string[];
  status: "active" | "inactive" | "pending";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

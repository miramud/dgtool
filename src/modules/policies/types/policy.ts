export interface Policy {
  id: string;
  title: string;
  category: string;
  status: "PUBLISHED" | "Draft";
  owner: { id: string; first_name: string; last_name: string };
  domains: string;
  lastUpdated: string;
  description?: string;
  content?: string;
  version?: string;
  createdBy?: string;
  createdAt?: string;
  effective_date?: string;
  reviewDate?: string;
  owner_name?: string;
  updated_datetime?: string;
  is_draft?: boolean;
}

export enum PolicyCategory {
  DATA_RETENTION = "Data Retention",
  NAMING_CONVENTION = "Naming Convention",
  DATA_PRIVACY = "Data Privacy",
  DATA_QUALITY = "Data Quality",
  ACCESS_CONTROL = "Access Control",
  DATA_SHARING = "Data Sharing",
  COMPLIANCE = "Compliance",
}

export enum PolicyStatus {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}

export interface PolicyFormData {
  title: string;
  category: string;
  description: string;
  domains: string;
  dataOwner: string;
  effective_date: string;
  reviewDate: string;
}

export interface CreatePolicyRequest extends PolicyFormData {
  status?: "Published" | "Draft";
}

export interface UpdatePolicyRequest extends Partial<PolicyFormData> {
  status?: "Published" | "Draft";
}

export interface PoliciesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Policy[];
}

export interface PoliciesFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  page_size?: number;
}

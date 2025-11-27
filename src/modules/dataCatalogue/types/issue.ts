export interface Issue {
  id: string;
  datasetId: string;
  title: string;
  type: IssueType;
  description: string;
  severity: SeverityLevel;
  status: IssueStatus;
  reportedBy: string;
  reportedAt: string;
  nextReviewDate?: string;
  dueDate?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  file?: File;
}

// API Response Types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

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

export interface Dataset {
  id: string;
  created_by: User;
  updated_by: User;
  dataset_type: string;
  metadata_template: string;
  created_datetime: string;
  updated_datetime: string;
  reference: string;
  name: string;
  description: string;
  business_domain: string;
  sensitivity: string;
  tags: string;
  raw_file: string;
  processed_file: string;
  client: string;
}

export interface IssueListItem {
  id: string;
  dataset_name: string;
  dataset_reference: string;
  title: string;
  issue_type: IssueType;
  issue_type_display: string;
  severity_level: SeverityLevel;
  severity_level_display: string;
  status: IssueStatus;
  status_display: string;
  due_date: string;
  is_overdue: boolean;
  created_by_name: string;
  created_datetime: string;
}

export interface IssueDetail {
  id: string;
  dataset: Dataset;
  client: Client;
  created_by: User;
  updated_by: User;
  days_until_due: number;
  days_until_review: number;
  days_overdue: number;
  time_open: Record<string, string>;
  created_datetime: string;
  updated_datetime: string;
  title: string;
  issue_type: IssueType;
  severity_level: SeverityLevel;
  next_review_date: string;
  due_date: string;
  status: IssueStatus;
  description: string;
  attachments: string;
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

export interface IssueListResponse {
  paginator: Paginator;
  results: IssueListItem[];
}

export interface CreateIssueRequest {
  dataset: string;
  title: string;
  issue_type: IssueType;
  severity_level: SeverityLevel;
  next_review_date?: string;
  due_date?: string;
  description: string;
  attachments?: string;
}

export interface UpdateIssueRequest {
  dataset: string;
  title?: string;
  issue_type?: IssueType;
  severity_level?: SeverityLevel;
  next_review_date?: string;
  due_date?: string;
  status?: IssueStatus;
  description?: string;
  attachments?: string;
}

export interface IssueFilters {
  search?: string;
  issue_type?: IssueType;
  severity_level?: SeverityLevel;
  status?: IssueStatus;
  dataset?: string;
  page?: number;
  page_size?: number;
}

export enum IssueType {
  DATA_QUALITY = "DATA_QUALITY",
  DATA_RETENTION = "DATA_RETENTION",
  MISSING_DATA = "MISSING_DATA",
  INCORRECT_DATA = "INCORRECT_DATA",
  SCHEMA_MISMATCH = "SCHEMA_MISMATCH",
  ACCESS_ISSUE = "ACCESS_ISSUE",
  PERFORMANCE = "PERFORMANCE",
  OTHER = "OTHER",
}

export enum SeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export const ISSUE_TYPE_OPTIONS = [
  { value: IssueType.DATA_QUALITY, label: "Data Quality" },
  { value: IssueType.DATA_RETENTION, label: "Data Retention" },
  { value: IssueType.MISSING_DATA, label: "Missing Data" },
  { value: IssueType.INCORRECT_DATA, label: "Incorrect Data" },
  { value: IssueType.SCHEMA_MISMATCH, label: "Schema Mismatch" },
  { value: IssueType.ACCESS_ISSUE, label: "Access Issue" },
  { value: IssueType.PERFORMANCE, label: "Performance Issue" },
  { value: IssueType.OTHER, label: "Other" },
];

export const SEVERITY_LEVEL_OPTIONS = [
  { value: SeverityLevel.LOW, label: "Low" },
  { value: SeverityLevel.MEDIUM, label: "Medium" },
  { value: SeverityLevel.HIGH, label: "High" },
  { value: SeverityLevel.CRITICAL, label: "Critical" },
];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  [IssueStatus.OPEN]: "Open",
  [IssueStatus.IN_PROGRESS]: "In Progress",
  [IssueStatus.RESOLVED]: "Resolved",
  [IssueStatus.CLOSED]: "Closed",
};

export interface ReportIssueFormData {
  title: string;
  type: IssueType;
  severity: SeverityLevel;
  nextReviewDate?: string;
  status: IssueStatus;
  dueDate?: string;
  description: string;
  file?: File;
}

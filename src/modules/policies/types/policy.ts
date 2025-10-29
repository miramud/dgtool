export interface Policy {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  dataOwner: string;
  domains: string[];
  lastUpdated: string;
  description?: string;
  content?: string;
  version?: string;
  createdBy?: string;
  createdAt?: string;
  effectiveDate?: string;
  reviewDate?: string;
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
  content: string;
  domains: string[];
  dataOwner: string;
  effectiveDate: string;
  reviewDate: string;
}
import { z } from "zod";

export interface DataCatalogue {
  id: string;
  name: string;
  description: string;
  dataset_type: string;
  businessTechnicalSpecification: BusinessTechnicalSpecification;
  sensitivity: string;
  businessDescription: BusinessDescription;
  usageGuidelines: UsageGuidelines;
  tags: string[];
  date: string;
  dataSource: DataSource;
  created_datetime: string;
  updated_datetime: string;
  data_owners_count: number;
  data_stewards_count: number;
}

export enum BusinessTechnicalSpecification {
  SCHEMA = "Schema",
  DATA_TYPE = "Data Type",
  SOURCE_SYSTEM = "Source System",
}

export enum BusinessDescription {
  CUSTOMER_DATA = "Customer Data",
  HR_DATA = "HR Data",
  TRANSACTION = "Transaction",
  VENDOR_DATA = "Vendor Data",
}

export enum UsageGuidelines {
  USAGE_GUIDELINES = "Usage Guidelines",
  FINANCIAL = "Financial",
  MARKETING = "Marketing",
  OPERATIONS = "Operations",
}

export enum DataSource {
  INTERNAL = "Internal",
  EXTERNAL = "External",
  PRIVATE = "Private",
}

export enum DataCatalogueStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DEPRECATED = "deprecated",
  DRAFT = "draft",
}

export const createDataCatalogueSchema = z.object({
  name: z.string().min(1, "Dataset name is required"),
  business_domain: z.string().min(1, "Business domain is required"),
  tags: z.string().min(1, "Tags are required"),
  sensitivity: z.enum(["INTERNAL", "EXTERNAL", "PRIVATE"]),
  description: z.string().min(1, "Description is required"),
  raw_file: z.string().min(1, "File is required"),
  dataset_type: z.string().min(1, "Dataset type is required"),
  metadata_template: z.string().optional(),
});

export type DataCatalogueFormData = z.infer<typeof createDataCatalogueSchema>;

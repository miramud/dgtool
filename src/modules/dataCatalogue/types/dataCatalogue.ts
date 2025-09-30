import { z } from "zod";

export interface DataCatalogue {
    id: string;
    businessTechnicalSpecification: BusinessTechnicalSpecification;
    businessDescription: BusinessDescription;
    usageGuidelines: UsageGuidelines;
    tags: string[];
    date: string;
    dataSource: DataSource;
    createdAt: string;
    updatedAt: string;
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
}

export enum DataCatalogueStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DEPRECATED = "deprecated",
    DRAFT = "draft",
}

export const createDataCatalogueSchema = z.object({
    datasetName: z.string().min(1, "Dataset name is required"),
    businessDomain: z.string().min(1, "Business domain is required"),
    tags: z.string().min(1, "Tags are required"),
    sensitivity: z.string().min(1, "Sensitivity level is required"),
    description: z.string().min(1, "Description is required"),
    datasetType: z.string().min(1, "Dataset type is required"),
});

export type DataCatalogueFormData = z.infer<typeof createDataCatalogueSchema>;
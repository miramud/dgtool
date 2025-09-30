import { DataCatalogue, BusinessTechnicalSpecification, BusinessDescription, UsageGuidelines, DataSource } from "../types/dataCatalogue";

export const mockDataCatalogue: DataCatalogue[] = [
    {
        id: "1",
        businessTechnicalSpecification: BusinessTechnicalSpecification.SCHEMA,
        businessDescription: BusinessDescription.CUSTOMER_DATA,
        usageGuidelines: UsageGuidelines.USAGE_GUIDELINES,
        tags: ["Production"],
        date: "Aug 10, 2025",
        dataSource: DataSource.INTERNAL,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:45:00Z",
    },
    {
        id: "2",
        businessTechnicalSpecification: BusinessTechnicalSpecification.DATA_TYPE,
        businessDescription: BusinessDescription.HR_DATA,
        usageGuidelines: UsageGuidelines.FINANCIAL,
        tags: ["Seismic"],
        date: "Aug 12, 2025",
        dataSource: DataSource.EXTERNAL,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-23T16:30:00Z",
    },
    {
        id: "3",
        businessTechnicalSpecification: BusinessTechnicalSpecification.SOURCE_SYSTEM,
        businessDescription: BusinessDescription.TRANSACTION,
        usageGuidelines: UsageGuidelines.MARKETING,
        tags: ["Production"],
        date: "Aug 11, 2025",
        dataSource: DataSource.INTERNAL,
        createdAt: "2024-01-17T14:20:00Z",
        updatedAt: "2024-01-22T10:10:00Z",
    },
    {
        id: "4",
        businessTechnicalSpecification: BusinessTechnicalSpecification.SCHEMA,
        businessDescription: BusinessDescription.VENDOR_DATA,
        usageGuidelines: UsageGuidelines.OPERATIONS,
        tags: ["Reservoir"],
        date: "Aug 12, 2025",
        dataSource: DataSource.INTERNAL,
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-18T12:30:00Z",
    }
];
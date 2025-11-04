export interface MetadataField {
  id: string;
  field_name: string;
  field_type:
    | "text"
    | "number"
    | "date"
    | "boolean"
    | "dropdown"
    | "select"
    | "multiselect";
  is_required: boolean;
  is_sensitive?: boolean;
  attributes?: string[];
  options?: string[];
  defaultValue?: any;
  description?: string;
}

export interface MetadataTemplate {
  id: string;
  name: string;
  description?: string;
  fields: MetadataField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  created_by?: { first_name: string; last_name: string };
  category?: string;
  unique_together_fields?: string[];
  // Legacy fields for backward compatibility
  dataset_type: {
    name: string;
  };
  fields_count?: number;
  lastModified?: string;
  status?: "active" | "inactive";
  is_active?: "active" | "inactive";
  updated_datetime: number;
}

export interface CreateMetadataTemplateRequest {
  name: string;
  description?: string;
  fields: Omit<MetadataField, "id">[];
  category?: string;
}

export interface UpdateMetadataTemplateRequest {
  name?: string;
  description?: string;
  fields?: Omit<MetadataField, "id">[];
  category?: string;
}

export interface MetadataTemplateFilters {
  search?: string;
  isActive?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}

export interface MetadataTemplateListResponse {
  templates: MetadataTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  paginator: {
    count: number;
    total_pages: number;
  };
  results: any;
}

// API-specific types to match backend specification
export interface MetadataTemplateFieldApi {
  field_name: string;
  field_type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "DROPDOWN";
  field_choices?: string;
  is_required: boolean;
  is_sensitive: boolean;
  is_unique: boolean;
  attributes?: string[];
  max_length?: number;
  min_value?: number;
  max_value?: number;
  validation_regex?: string;
}

export interface CreateMetadataTemplateApiRequest {
  fields: MetadataTemplateFieldApi[];
  name: string;
  description?: string;
  is_active: boolean;
  unique_together_fields?: string[];
  dataset_type: string; // UUID
}

// Helper function to convert UI field to API field
export const convertFieldToApi = (
  field: Omit<MetadataField, "id">
): MetadataTemplateFieldApi => {
  const fieldTypeMap = {
    text: "TEXT" as const,
    number: "NUMBER" as const,
    date: "DATE" as const,
    boolean: "BOOLEAN" as const,
    dropdown: "DROPDOWN" as const,
    select: "DROPDOWN" as const,
    multiselect: "DROPDOWN" as const,
  };

  return {
    field_name: field.field_name,
    field_type: fieldTypeMap[field.field_type] || "TEXT",
    field_choices: field.options?.join(","),
    is_required: field.is_required,
    is_sensitive: field.is_sensitive || false,
    is_unique: false, // Default value, can be made configurable later
    attributes: field.attributes || [],
  };
};

export interface MetadataField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "select" | "multiselect";
  required: boolean;
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
  createdBy?: string;
  category?: string;
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
}
export interface MetadataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'boolean';
  required: boolean;
  sensitive: boolean;
  options?: string[];
}

export interface MetadataTemplate {
  id: string;
  name: string;
  description: string;
  datasetType: string;
  fields: MetadataField[];
  fieldsNumber: number;
  createdBy: string;
  lastModified: string;
  status: 'active' | 'inactive';
}

export interface CreateMetadataTemplateRequest {
  name: string;
  description: string;
  datasetType: string;
  fields: Omit<MetadataField, 'id'>[];
}
export interface DatasetType {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  lastModified: string;
  status: 'active' | 'inactive';
}

export interface CreateDatasetTypeRequest {
  name: string;
  description: string;
}
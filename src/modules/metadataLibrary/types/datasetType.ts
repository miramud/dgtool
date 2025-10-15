export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string | null;
}

export interface DatasetType {
  id: string;
  name: string;
  description: string;
  created_by: User;
  updated_by: User;
  created_datetime: string;
  updated_datetime: string;
  deleted_datetime: string | null;
  is_deleted: boolean;
  is_archived: boolean;
  status: boolean;
}

export interface Paginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  next_page_number: number | null;
  previous: string | null;
  previous_page_number: number | null;
}

export interface DatasetTypeApiResponse {
  status: boolean;
  message: string;
  data: {
    paginator: Paginator;
    results: DatasetType[];
  };
}

export interface CreateDatasetTypeRequest {
  name: string;
  description: string;
}

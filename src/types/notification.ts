export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface NotificationUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

export interface Notification {
  id: string;
  user: NotificationUser;
  notification_type_display: string;
  created_datetime: string;
  updated_datetime: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  read_datetime: string | null;
  link: string | null;
  object_id: string | null;
  content_type: number | null;
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

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: {
    paginator: Paginator;
    results: Notification[];
  };
}

export interface NotificationsFilters {
  search?: string;
  is_read?: boolean;
  notification_type?: NotificationType;
  page?: number;
  page_size?: number;
}

export interface MarkAsReadRequest {
  notification_ids: string[];
}

export interface MarkAsUnreadRequest {
  notification_ids: string[];
}

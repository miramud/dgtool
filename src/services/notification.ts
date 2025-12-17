import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { NOTIFICATION_API_ROUTES } from "@/constants/notification-api-routes";
import {
  NotificationsResponse,
  NotificationsFilters,
  MarkAsReadRequest,
  MarkAsUnreadRequest,
} from "@/types/notification";

export const notificationService = {
  async getNotifications(
    filters?: NotificationsFilters
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.is_read !== undefined)
      params.append("is_read", String(filters.is_read));
    if (filters?.notification_type)
      params.append("notification_type", filters.notification_type);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const queryString = params.toString();
    const url = `${NOTIFICATION_API_ROUTES.GET_NOTIFICATIONS}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient.get<NotificationsResponse>(url);
    return response.data;
  },

  async markAsRead(data: MarkAsReadRequest): Promise<IResponse<void>> {
    const response = await apiClient.post<IResponse<void>>(
      NOTIFICATION_API_ROUTES.MARK_AS_READ,
      data
    );
    return response.data;
  },

  async markAsUnread(data: MarkAsUnreadRequest): Promise<IResponse<void>> {
    const response = await apiClient.post<IResponse<void>>(
      NOTIFICATION_API_ROUTES.MARK_AS_UNREAD,
      data
    );
    return response.data;
  },
};

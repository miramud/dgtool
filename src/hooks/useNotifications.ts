import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification";
import {
  NotificationsFilters,
  MarkAsReadRequest,
  MarkAsUnreadRequest,
} from "@/types/notification";

const QUERY_KEYS = {
  notifications: "notifications",
};

export const useNotifications = (filters?: NotificationsFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.notifications, filters],
    queryFn: () => notificationService.getNotifications(filters),
    select: (data) => data.data,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAsReadRequest) =>
      notificationService.markAsRead(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] });
      toast.success(response.message || "Notifications marked as read");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to mark notifications as read";
      toast.error(message);
    },
  });
};

export const useMarkAsUnread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAsUnreadRequest) =>
      notificationService.markAsUnread(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] });
      toast.success(response.message || "Notifications marked as unread");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to mark notifications as unread";
      toast.error(message);
    },
  });
};

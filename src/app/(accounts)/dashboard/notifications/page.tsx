"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, X, MoreVertical } from "lucide-react";
import { useNotifications, useMarkAsRead, useMarkAsUnread } from "@/hooks/useNotifications";
import { Notification } from "@/types/notification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Helper function to group notifications by date
const groupNotificationsByDate = (notifications: Notification[]) => {
  const now = new Date();
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const older: Notification[] = [];

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.created_datetime);
    const diffInDays = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      today.push(notification);
    } else if (diffInDays === 1) {
      yesterday.push(notification);
    } else {
      older.push(notification);
    }
  });

  return { today, yesterday, older };
};

export default function NotificationsPage() {
  const [page] = useState(1);
  const { data, isLoading, isError, error } = useNotifications({ page, page_size: 50 });
  const markAsRead = useMarkAsRead();
  const markAsUnread = useMarkAsUnread();

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate({ notification_ids: [notificationId] });
  };

  const handleMarkAsUnread = (notificationId: string) => {
    markAsUnread.mutate({ notification_ids: [notificationId] });
  };

  const renderNotificationCard = (notification: Notification) => {
    const timeAgo = formatDistanceToNow(new Date(notification.created_datetime), {
      addSuffix: true,
    });

    return (
      <div
        key={notification.id}
        className={cn(
          "rounded-lg p-4 transition-colors group relative",
          notification.is_read ? "bg-gray-50" : "bg-gray-100"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3
              className={cn(
                "text-base text-gray-900",
                !notification.is_read && "font-semibold"
              )}
            >
              {notification.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {timeAgo}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notification.is_read ? (
                  <DropdownMenuItem
                    onClick={() => handleMarkAsUnread(notification.id)}
                    disabled={markAsUnread.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Mark as unread
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={markAsRead.isPending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as read
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-600">{notification.message}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-background p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your latest notifications.
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full bg-background p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your latest notifications.
          </p>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading notifications</p>
          <p className="text-red-600 text-sm mt-1">
            {(error as any)?.response?.data?.message ||
              (error as any)?.message ||
              "Failed to load notifications"}
          </p>
        </div>
      </div>
    );
  }

  const notifications = data?.results || [];
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="w-full h-full bg-background p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Stay updated with your latest notifications.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Today Section */}
          {groupedNotifications.today.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Today</h2>
              <div className="space-y-4">
                {groupedNotifications.today.map(renderNotificationCard)}
              </div>
            </div>
          )}

          {/* Yesterday Section */}
          {groupedNotifications.yesterday.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Yesterday</h2>
              <div className="space-y-4">
                {groupedNotifications.yesterday.map(renderNotificationCard)}
              </div>
            </div>
          )}

          {/* Older Section */}
          {groupedNotifications.older.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Older</h2>
              <div className="space-y-4">
                {groupedNotifications.older.map(renderNotificationCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

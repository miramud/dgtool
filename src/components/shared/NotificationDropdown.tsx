"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications({ page: 1, page_size: 6 });

  const notifications = data?.results || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-base">Notifications</h3>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const timeAgo = formatDistanceToNow(
                  new Date(notification.created_datetime),
                  { addSuffix: true }
                );

                return (
                  <Link
                    key={notification.id}
                    href="/dashboard/notifications"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block p-4 hover:bg-gray-50 transition-colors",
                      !notification.is_read && "bg-blue-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={cn(
                          "text-sm text-gray-900 line-clamp-1",
                          !notification.is_read && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400">{timeAgo}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-gray-50">
          <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-sm font-medium text-[#4A4A7A] hover:text-[#4A4A7A]/90 hover:bg-[#4A4A7A]/10"
            >
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

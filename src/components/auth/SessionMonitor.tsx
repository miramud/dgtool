"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { handleSessionExpiry, isSessionExpired } from "@/lib/auth-utils";

interface SessionMonitorProps {
  /**
   * Check interval in milliseconds (default: 5 minutes)
   */
  checkInterval?: number;
  /**
   * Whether to show toast notifications for session expiry
   */
  showToasts?: boolean;
}

/**
 * SessionMonitor component that periodically checks session validity
 * and automatically logs out expired sessions
 */
export const SessionMonitor: React.FC<SessionMonitorProps> = ({
  checkInterval = 5 * 60 * 1000, // 5 minutes
  showToasts = true,
}) => {
  const { data: session, status } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only monitor when user is authenticated
    if (status !== "authenticated" || !session?.user?.token) {
      return;
    }

    const checkSessionValidity = async () => {
      try {
        const token = localStorage.getItem("access_token") || session.user.token;
        
        if (!token || isSessionExpired(token)) {
          await handleSessionExpiry(showToasts);
          return;
        }

        // Additional check: verify token with backend periodically
        // This could be enhanced to make a lightweight API call to validate the token
      } catch (error) {
        console.error("Session validity check failed:", error);
        await handleSessionExpiry(showToasts);
      }
    };

    // Initial check
    checkSessionValidity();

    // Set up periodic checks
    intervalRef.current = setInterval(checkSessionValidity, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session, status, checkInterval, showToasts]);

  // Also monitor for page visibility changes and check session when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && status === "authenticated") {
        const token = localStorage.getItem("access_token") || session?.user?.token;
        if (token && isSessionExpired(token)) {
          await handleSessionExpiry(showToasts);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session, status, showToasts]);

  return null; // This is a utility component with no UI
};
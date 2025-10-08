import { useState } from "react";
import { performLogout } from "@/lib/auth-utils";

/**
 * Hook for handling user logout with loading state
 */
export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async (showToast: boolean = true) => {
    try {
      setIsLoggingOut(true);
      await performLogout(showToast);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback logout
      await performLogout(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
  };
};
import { signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * Handles session expiry by clearing all authentication data and redirecting to login
 */
export const handleSessionExpiry = async (showToast: boolean = true) => {
  try {
    // Show user-friendly message
    if (showToast) {
      toast.error("Your session has expired. Please sign in again.");
    }

    // Clear localStorage
    localStorage.removeItem("access_token");

    // Clear any other auth-related data in localStorage
    const authKeys = Object.keys(localStorage).filter(
      (key) =>
        key.includes("auth") || key.includes("token") || key.includes("session")
    );
    authKeys.forEach((key) => localStorage.removeItem(key));

    // Sign out from NextAuth (clears session and JWT)
    await signOut({
      redirect: false, // We'll handle redirect manually
      callbackUrl: "/auth/signin",
    });

    // Force redirect to login page
    window.location.href = "/auth/signin";
  } catch (error) {
    console.error("Error during session expiry handling:", error);
    // Fallback: direct redirect
    window.location.href = "/auth/signin";
  }
};

/**
 * Checks if the current session/token is expired
 */
export const isSessionExpired = (token?: string): boolean => {
  if (!token) return true;

  try {
    // If JWT token, decode and check expiry
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    // If not a JWT or parsing fails, consider it expired
    console.log("error", error);

    return true;
  }
};

/**
 * Enhanced logout function that ensures complete cleanup
 */
export const performLogout = async (showToast: boolean = true) => {
  if (showToast) {
    toast.success("Successfully logged out");
  }

  await handleSessionExpiry(false);
};

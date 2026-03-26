import axios from "axios";
import { getSession } from "next-auth/react";
import {
  getAuthorizationHeader,
  handleSessionExpiry,
  isSessionExpired,
} from "./auth-utils";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosCaller = axios.create({
  baseURL: baseURL,
  headers: {},
  timeout: 60000,
});

export const axiosCallerWithToken = axios.create({
  baseURL,
  headers: {},
});

let retryCount = 0;

axiosCallerWithToken.interceptors.request.use(
  async (config) => {
    // Try to get token from localStorage first, then fallback to session
    let token = localStorage.getItem("access_token");

    if (!token) {
      const session = await getSession();
      token = session?.user?.token ?? null;
    }

    // Check if token is expired before making request
    if (token && isSessionExpired(token)) {
      await handleSessionExpiry();
      return Promise.reject(new Error("Session expired"));
    }

    if (!token && retryCount < 3) {
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return axiosCallerWithToken.request(config);
    }

    if (!token && retryCount >= 3) {
      retryCount = 0;
      await handleSessionExpiry();
      return Promise.reject(new Error("No valid token available"));
    }

    const authorizationHeader = getAuthorizationHeader(token);

    if (authorizationHeader) {
      config.headers.Authorization = authorizationHeader;
    }

    retryCount = 0;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosCallerWithToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle 401 unauthorized responses (session expired)
      await handleSessionExpiry();
    }
    return Promise.reject(error);
  }
);

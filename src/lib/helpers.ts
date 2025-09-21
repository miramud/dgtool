import axios from "axios";
import { getSession } from "next-auth/react";

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
        const session = await getSession();
        const token = session?.user?.token;

        if (!token && retryCount < 3) {
            retryCount++;
            await new Promise((resolve) => setTimeout(resolve, 100));
            return axiosCallerWithToken.request(config);
        }

        if (!token && retryCount >= 3) {
            retryCount = 0;
            return config;
        }

        config.headers.Authorization = `Bearer ${token}`;
        retryCount = 0;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosCallerWithToken.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // showToast.success("Login session expired");
            window.location.href = "/auth/login";
            localStorage.removeItem("access_token");
            // window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

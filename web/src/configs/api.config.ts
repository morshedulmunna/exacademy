"use server";

import { clearAllServerCookies, getServerCookie, setServerCookie } from "@/lib/server-storages";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { redirect } from "next/navigation";

/**
 * API Configuration and Axios Instance
 * Provides a configured axios instance with interceptors for authentication,
 * error handling, and request/response processing.
 */

// Environment-based API base URL
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:9098";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Axios instance configuration
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
};

/**
 * Creates and configures the main axios instance
 */
export const API: AxiosInstance = axios.create(axiosConfig);

/**
 * Adds an interceptor to automatically include the token from localStorage
 */
API.interceptors.request.use(
  async (config) => {
    // Only access localStorage in browser environment
    const token = await getServerCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common responses and errors
 */
API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      // Don't try to refresh token for login/register endpoints
      const isAuthEndpoint = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register") || originalRequest.url?.includes("/api/auth/login") || originalRequest.url?.includes("/api/auth/register");

      if (!isAuthEndpoint) {
        // Try to refresh the token
        try {
          const refreshToken = await getServerCookie("refresh_token");

          if (refreshToken) {
            const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token } = refreshResponse.data;

            // Update tokens in localStorage
            setServerCookie("access_token", access_token);
            setServerCookie("refresh_token", refresh_token);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axios(originalRequest);
          } else {
            // No refresh token available, redirect to login
            handleAuthFailure();
            return Promise.reject(new Error("No refresh token available"));
          }
        } catch (refreshError) {
          // Refresh failed, check if we've exceeded max retries
          // Max retries exceeded, redirect to login and clear tokens
          handleAuthFailure();

          return Promise.reject(refreshError);
        }
      }
    }

    // Ensure error is properly formatted for better debugging
    if (error.response) {
      // Server responded with error status
      console.error(`API Error ${error.response.status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received - avoid logging circular references
      console.error("API Request Error (No Response):", {
        url: error.config?.url,
        method: error.config?.method,
        statusText: error.request.statusText,
        readyState: error.request.readyState,
        responseURL: error.request.responseURL,
        // Don't log the entire request object to avoid circular references
      });
    } else {
      // Something else happened
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Export the raw axios instance for advanced use cases
 */
export default API;

const handleAuthFailure = async () => {
  await clearAllServerCookies();
  // Redirect to login page
  redirect("/login");
};

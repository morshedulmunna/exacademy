"use server";
import { removeLocalStorageItem } from "@/lib/utils";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { cookies } from "next/headers";

/**
 * API Configuration and Axios Instance
 * Provides a configured axios instance with interceptors for authentication,
 * error handling, and request/response processing.
 *
 * Development mode: Uses cookies for token storage
 * Production mode: Uses Authorization headers with localStorage fallback
 */

// Environment-based API base URL
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:9098";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Maximum retry attempts for failed requests
const MAX_RETRY_ATTEMPTS = 5;

// Track retry attempts for each request
const retryCounts = new Map<string, number>();

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

// Cookie names for development mode
const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

async function getCookie(cookieName: string) {
  const cookieStore = await cookies();
  const info = cookieStore.get(cookieName);
  return info;
}

async function setCookie(cookieName: string, cookieValue: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, cookieValue);
}

async function deleteCookie(cookieName: string) {
  (await cookies()).delete(cookieName);
}

/**
 * Handles authentication failure by clearing tokens and redirecting to login
 */
const handleAuthFailure = (): void => {
  // Development mode: Clear cookies
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);

  // Clear user data from localStorage (common for both modes)
  removeLocalStorageItem("user");

  // Clear retry counts
  retryCounts.clear();

  // Redirect to login page if in browser environment
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Axios instance configuration
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: isDevelopment, // Enable cookies in development mode
};

/**
 * Creates and configures the main axios instance
 */
export const API: AxiosInstance = axios.create(axiosConfig);

/**
 * Adds an interceptor to automatically include the token from cookies or headers
 */
API.interceptors.request.use(
  async (config) => {
    const token = (await getCookie(ACCESS_TOKEN_COOKIE))?.value;
    console.log(token, "TOken______");
    // Production mode: Get token from localStorage and set in headers
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

    // Create a unique key for this request to track retry attempts
    const requestKey = `${originalRequest.method}-${originalRequest.url}`;
    const currentRetryCount = retryCounts.get(requestKey) || 0;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && currentRetryCount < MAX_RETRY_ATTEMPTS) {
      // Don't try to refresh token for login/register endpoints
      const isAuthEndpoint = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register") || originalRequest.url?.includes("/api/auth/login") || originalRequest.url?.includes("/api/auth/register");

      if (!isAuthEndpoint) {
        // Increment retry count
        retryCounts.set(requestKey, currentRetryCount + 1);

        // Try to refresh the token
        try {
          const refreshToken = (await getCookie(REFRESH_TOKEN_COOKIE))?.value;

          if (refreshToken) {
            const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token } = refreshResponse.data;

            // Update tokens based on mode
            setCookie(ACCESS_TOKEN_COOKIE, access_token);
            setCookie(REFRESH_TOKEN_COOKIE, refresh_token);

            // In production mode, retry with new token in headers
            if (!isDevelopment) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }

            return axios(originalRequest);
          } else {
            // No refresh token available, redirect to login
            handleAuthFailure();
            return Promise.reject(new Error("No refresh token available"));
          }
        } catch (refreshError) {
          // Refresh failed, check if we've exceeded max retries
          if (currentRetryCount >= MAX_RETRY_ATTEMPTS - 1) {
            // Max retries exceeded, redirect to login and clear tokens
            handleAuthFailure();
            return Promise.reject(new Error("Maximum retry attempts exceeded. Please login again."));
          }

          // Still have retries left, continue with current retry count
          return Promise.reject(refreshError);
        }
      }
    }

    // Clear retry count for successful requests or non-401 errors
    if (error.response?.status !== 401) {
      retryCounts.delete(requestKey);
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

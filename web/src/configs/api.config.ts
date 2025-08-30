import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

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

// Attach Authorization header from access_token (server via Next cookies, client via cookie/localStorage)
API.interceptors.request.use(async (config) => {
  try {
    let token: string | undefined;

    // Server-side: read from request cookies
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("access_token")?.value as any;
      } catch {}
    }

    // Client-side: try cookie, then localStorage
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.split("; ").find((row) => row.startsWith("access_token="));
      if (match) token = decodeURIComponent(match.split("=")[1]);

      if (!token) {
        try {
          const raw = window.localStorage.getItem("access_token");
          if (raw) {
            try {
              // Handle values saved via JSON.stringify
              token = JSON.parse(raw);
            } catch {
              token = raw;
            }
          }
        } catch {}
      }
    }

    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  } catch {}

  return config;
});

export default API;

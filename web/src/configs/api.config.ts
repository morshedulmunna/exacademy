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

    // Client-side: read from cookie only
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.split("; ").find((row) => row.startsWith("access_token="));
      if (match) token = decodeURIComponent(match.split("=")[1]);
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

// Handle 401 responses: try refresh then retry once
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const status = (error.response?.status as number) || 0;

    const url = String(originalRequest?.url || "");
    const isAuthEndpoint = url.includes("/api/auth/");
    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        // Get refresh token from cookie only
        let refreshToken: string | undefined;

        if (typeof window === "undefined") {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            refreshToken = cookieStore.get("refresh_token")?.value as any;
          } catch {}
        } else {
          const match = document.cookie.split("; ").find((row) => row.startsWith("refresh_token="));
          if (match) refreshToken = decodeURIComponent(match.split("=")[1]);
        }

        if (!refreshToken) throw new Error("Missing refresh token");

        const refreshResponse = await API.post("/api/auth/refresh", { refresh_token: refreshToken });
        const data: any = refreshResponse?.data?.data || {};
        const newAccessToken: string | undefined = data?.access_token;
        const newRefreshToken: string | undefined = data?.refresh_token;

        if (!newAccessToken) throw new Error("Failed to refresh token");

        // Persist new tokens as cookies only (client-side)
        if (typeof document !== "undefined") {
          if (newAccessToken) {
            document.cookie = `access_token=${encodeURIComponent(newAccessToken)}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
          }
          if (newRefreshToken) {
            document.cookie = `refresh_token=${encodeURIComponent(newRefreshToken)}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
          }
        }

        // Update header and retry original request
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return API(originalRequest);
      } catch (refreshError) {
        // On refresh failure, clear cookies (client) and reject
        if (typeof document !== "undefined") {
          try {
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
              if (!name) continue;
              document.cookie = `${name}=; Max-Age=0; path=/`;
            }
          } catch {}
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;

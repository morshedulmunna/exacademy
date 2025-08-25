import { HOST } from "@/constant";

type RequestConfig = {
  body?: any;
  contentType?: string;
  endpoint: string;
};

type Interceptor = {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onResponse?: (response: Response) => Response | Promise<Response>;
  onError?: (error: any) => any;
};

/**
 * Reads a cookie value by name from document cookies in the browser.
 * Returns null when executed in a non-browser environment or when missing.
 */
const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
};

class ApiInstanc {
  private baseURL: string;
  private interceptors: Interceptor;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.interceptors = {};
  }

  setInterceptors(interceptors: Interceptor) {
    this.interceptors = interceptors;
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    if (this.interceptors.onRequest) {
      return await this.interceptors.onRequest(config);
    }
    return config;
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    if (this.interceptors.onResponse) {
      return await this.interceptors.onResponse(response);
    }
    return response;
  }

  private async applyErrorInterceptors(error: any): Promise<any> {
    if (this.interceptors.onError) {
      return await this.interceptors.onError(error);
    }
    throw error;
  }

  private async makeRequest(method: string, config: RequestConfig, attempt: number = 0): Promise<any> {
    try {
      const interceptedConfig = await this.applyRequestInterceptors(config);

      const fetchOptions: RequestInit = {
        method,
        headers: {},
        // Ensure browser includes cookies set by backend
        credentials: "include",
      };

      // Attach Authorization header from access_token cookie if present (browser only)
      const accessToken = getCookieValue("access_token");
      if (accessToken) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }

      // When running on the server (server actions, RSC), read the cookie
      // from the current request using next/headers and attach Authorization
      if (typeof window === "undefined") {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const serverAccessToken = cookieStore.get("access_token")?.value;
          if (serverAccessToken) {
            fetchOptions.headers = {
              ...fetchOptions.headers,
              Authorization: `Bearer ${serverAccessToken}`,
            };
          }
        } catch (_) {
          // no-op: next/headers not available in this context
        }
      }

      // Handle FormData differently from JSON
      if (method !== "GET" && interceptedConfig.body) {
        if (interceptedConfig.body instanceof FormData) {
          // Don't set Content-Type for FormData, let the browser set it with boundary
          fetchOptions.body = interceptedConfig.body;
        } else {
          // For JSON data
          fetchOptions.headers = {
            ...fetchOptions.headers,
            "Content-Type": interceptedConfig.contentType || "application/json",
          };
          fetchOptions.body = JSON.stringify(interceptedConfig.body);
        }
      }

      if (method === "GET") {
        fetchOptions.next = { revalidate: 0 };
      }

      const response = await fetch(`${this.baseURL}${interceptedConfig.endpoint}`, fetchOptions);
      const interceptedResponse = await this.applyResponseInterceptors(response);

      if (!interceptedResponse.ok) {
        const err = await interceptedResponse.json();
        throw err;
      }

      const data = await interceptedResponse.json();
      return data;
    } catch (error: any) {
      await this.applyErrorInterceptors(error);
      throw error;
    }
  }

  async get(config: RequestConfig) {
    return this.makeRequest("GET", config);
  }

  async post(config: RequestConfig) {
    return this.makeRequest("POST", config);
  }

  async put(config: RequestConfig) {
    return this.makeRequest("PUT", config);
  }

  async patch(config: RequestConfig) {
    return this.makeRequest("PATCH", config);
  }

  async delete(config: RequestConfig) {
    return this.makeRequest("DELETE", config);
  }
}

// Create and configure the fetch instance
const FetchAPI = new ApiInstanc(HOST);

// Set up default interceptors
FetchAPI.setInterceptors({
  onRequest: async (config) => {
    // Add any default request modifications here
    return config;
  },
  onResponse: async (response) => {
    // If unauthorized, redirect to login (client-side only)
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        const current = window.location.pathname + window.location.search;
        const isOnLogin = window.location.pathname.startsWith("/login");
        if (!isOnLogin) {
          window.location.href = `/login?redirectTo=${encodeURIComponent(current)}`;
        }
      }
    }
    return response;
  },
  onError: async (error) => {
    // If backend returned an unauthorized error payload, redirect (client-side only)
    const status = error?.status ?? error?.statusCode;
    if (status === 401 && typeof window !== "undefined") {
      const current = window.location.pathname + window.location.search;
      const isOnLogin = window.location.pathname.startsWith("/login");
      if (!isOnLogin) {
        window.location.href = `/login?redirectTo=${encodeURIComponent(current)}`;
      }
    }
    // Re-throw so callers can catch and handle API errors properly
    throw error;
  },
});

export default FetchAPI;

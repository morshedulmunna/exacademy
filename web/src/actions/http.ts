import { HOST } from "@/constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  private async getToken() {
    try {
      // Try to get from cookies (server-side)
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token");
      if (token?.value) {
        return token.value;
      }

      // If running on client-side, try localStorage
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.token) {
            return userData.token;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting token:", error);
      // If cookies() fails (client-side), try localStorage
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.token) {
            return userData.token;
          }
        }
      }
      return null;
    }
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

  private async makeRequest(method: string, config: RequestConfig) {
    try {
      const token = await this.getToken();
      const interceptedConfig = await this.applyRequestInterceptors(config);

      const fetchOptions: RequestInit = {
        method,
        headers: {},
      };

      // Attach Authorization header only when a valid token exists
      if (token && typeof token === "string" && token.trim()) {
        (fetchOptions.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
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
        if (interceptedResponse.status === 401) {
          redirect("/");
          return;
        }
        const err = await interceptedResponse.json();
        throw err;
      }

      const data = await interceptedResponse.json();
      return data;
    } catch (error) {
      return this.applyErrorInterceptors(error);
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
    // Add any default response modifications here
    return response;
  },
  onError: async (error) => {
    return error;
  },
});

export default FetchAPI;

// Helper to persist authentication tokens into secure cookies (server-side only)
export async function setAuthCookies(params: { access_token: string; refresh_token: string; token_type?: string; expires_in?: number }) {
  const cookieStore = await cookies();
  const oneHour = 60 * 60;
  const thirtyDays = 60 * 60 * 24 * 30;

  cookieStore.set("access_token", params.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: typeof params.expires_in === "number" ? params.expires_in : oneHour,
  });

  cookieStore.set("refresh_token", params.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: thirtyDays,
  });

  if (params.token_type) {
    cookieStore.set("token_type", params.token_type, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: thirtyDays,
    });
  }
}

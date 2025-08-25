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
    // Add any default response modifications here
    return response;
  },
  onError: async (error) => {
    // Re-throw so callers can catch and handle API errors properly
    throw error;
  },
});

export default FetchAPI;

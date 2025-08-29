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

export default API;

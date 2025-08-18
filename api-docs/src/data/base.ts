import { ApiDocConfig } from "@/types/api";

/**
 * Base API documentation metadata (without categories)
 */
export const baseConfig: Omit<ApiDocConfig, "categories"> = {
  title: "Execute Academy API",
  version: "v1.0.0",
  description: "Comprehensive API documentation for Execute Academy platform",
  baseUrl: "https://api.executeacademy.com/v1",
  authentication: {
    type: "bearer",
    description: "All API requests require a valid Bearer token in the Authorization header",
  },
  rateLimiting: {
    description: "API requests are rate limited to ensure fair usage",
    limits: ["100 requests per minute for authenticated users", "10 requests per minute for unauthenticated users"],
  },
};

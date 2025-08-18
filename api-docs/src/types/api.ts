/**
 * API Endpoint definition
 */
export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  title: string
  description: string
  category: string
  tags: string[]
  parameters?: ApiParameter[]
  requestBody?: ApiRequestBody
  responses: ApiResponse[]
  examples?: ApiExample[]
  deprecated?: boolean
  rateLimited?: boolean
  authentication?: 'none' | 'bearer' | 'api-key' | 'oauth2'
}

/**
 * API Parameter definition
 */
export interface ApiParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description: string
  defaultValue?: any
  example?: any
  enum?: any[]
  location: 'path' | 'query' | 'header'
}

/**
 * API Request Body definition
 */
export interface ApiRequestBody {
  required: boolean
  description: string
  contentType: string
  schema: any
  example?: any
}

/**
 * API Response definition
 */
export interface ApiResponse {
  statusCode: number
  description: string
  contentType: string
  schema?: any
  example?: any
}

/**
 * API Example definition
 */
export interface ApiExample {
  title: string
  description: string
  request?: {
    headers?: Record<string, string>
    body?: any
  }
  response?: {
    statusCode: number
    body: any
  }
}

/**
 * API Category definition
 */
export interface ApiCategory {
  id: string
  name: string
  description: string
  endpoints: ApiEndpoint[]
}

/**
 * API Documentation configuration
 */
export interface ApiDocConfig {
  title: string
  version: string
  description: string
  baseUrl: string
  categories: ApiCategory[]
  authentication?: {
    type: 'bearer' | 'api-key' | 'oauth2'
    description: string
  }
  rateLimiting?: {
    description: string
    limits: string[]
  }
}

/**
 * Search result for API endpoints
 */
export interface SearchResult {
  endpoint: ApiEndpoint
  category: ApiCategory
  relevance: number
}

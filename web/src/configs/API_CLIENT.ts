import { AuthApi, UsersApi, CoursesApi, Configuration } from "@/api";

// Create API configuration with the base URL from environment
const config = new Configuration({
  basePath: process.env.API_BASE_URL || "http://127.0.0.1:8080",
});

export const AUTH_API = new AuthApi(config);
export const USER_API = new UsersApi(config);
export const COURSES_API = new CoursesApi(config);

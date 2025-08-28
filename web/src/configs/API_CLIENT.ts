import { AuthApi, UsersApi, CoursesApi, Configuration, ResponseError } from "@/api";

// Create API configuration with the base URL from environment
const config = new Configuration({
  basePath: process.env.API_BASE_URL || "http://127.0.0.1:9098",
  headers: {},
});

export const AUTH_API = new AuthApi(config);
export const USER_API = new UsersApi(config);
export const COURSES_API = new CoursesApi(config);

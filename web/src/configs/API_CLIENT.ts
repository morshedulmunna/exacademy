import { AuthApi, UsersApi, CoursesApi, Configuration, ResponseError } from "@/api";

// Create API configuration with the base URL from environment
const config = new Configuration({
  basePath: process.env.API_BASE_URL || "http://127.0.0.1:9098",
});

export const AUTH_API = new AuthApi(config);
export const USER_API = new UsersApi(config);
export const COURSES_API = new CoursesApi(config);

export const ErrorResponse = async (error: unknown) => {
  // Handle ResponseError to get backend error message
  if (error instanceof ResponseError) {
    try {
      const errorBody = await error.response.json();
      console.log(errorBody);

      // Check if the error body has the expected structure
      if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
        return errorBody.message;
      }

      // Fallback to the error message if no structured error body
      return errorBody || "Something went wrong!";
    } catch {
      // If we can't parse the response body, return the error message
      return error.message || "Something went wrong!";
    }
  }

  // For other errors
  if (error instanceof Error) {
    return error.message || "Something went wrong!";
  }

  return "Something went wrong!";
};

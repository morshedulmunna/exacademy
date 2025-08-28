import { ResponseError } from "@/api";

export const ErrorResponse = async (error: unknown) => {
  // Handle ResponseError to get backend error message
  if (error instanceof ResponseError) {
    try {
      const errorBody = await error.response.json();
      console.log(errorBody);
      if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
        return errorBody.message;
      }

      return errorBody || "Something went wrong!";
    } catch {
      return error.message || "Something went wrong!";
    }
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong!";
  }

  return "Something went wrong!";
};

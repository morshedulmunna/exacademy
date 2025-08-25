"use server";

import FetchAPI from "@/actions/http";

type LoginPayload = {
  email: string;
  password: string;
};

/**
 * Perform login against backend API and persist tokens in cookies.
 * Returns the API payload for the caller to use (e.g., user data).
 */
export async function loginAction(payload: LoginPayload) {
  try {
    const response = await FetchAPI.post({
      endpoint: "/api/auth/login",
      body: payload,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

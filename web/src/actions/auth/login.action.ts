"use server";

import FetchAPI, { setAuthCookies } from "@/actions/http";

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
    const data = (response as any)?.data;
    if (data?.access_token && data?.refresh_token) {
      await setAuthCookies({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
      });
    }
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

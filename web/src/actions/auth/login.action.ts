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
  const response = await FetchAPI.post({
    endpoint: "/api/auth/login",
    body: payload,
    contentType: "application/json",
  });

  // Expected response shape per docs
  // {
  //   message, timestamp, status_code,
  //   data: { user, access_token, refresh_token, token_type, expires_in }
  // }
  if (!response || typeof response !== "object") {
    throw new Error("Invalid login response");
  }

  const data = (response as any).data;
  if (!data?.access_token || !data?.refresh_token) {
    throw new Error("Login response missing tokens");
  }

  await setAuthCookies({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
  });

  return response;
}

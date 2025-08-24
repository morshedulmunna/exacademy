"use server";

import FetchAPI, { setAuthCookies } from "@/actions/http";

type GoogleLoginPayload = {
  id_token: string;
};

/**
 * Exchange a Google ID token for our API tokens and set auth cookies.
 */
export async function googleLoginAction(payload: GoogleLoginPayload) {
  const response = await FetchAPI.post({
    endpoint: "/api/auth/google",
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
}

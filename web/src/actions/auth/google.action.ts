"use server";

import FetchAPI from "@/actions/http";

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

  return response;
}

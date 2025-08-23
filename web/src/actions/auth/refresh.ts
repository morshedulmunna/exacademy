import { ServerFetch, type ApiEnvelope } from "@/actions/http";

export type RefreshInput = { refresh_token: string };

export type RefreshResponseData = {
  access_token: string;
  refresh_token: string; // echoes the same refresh token per docs
  token_type: string;
  expires_in: number;
};

/**
 * Exchange a refresh token for a new access token.
 */
export async function refresh(input: RefreshInput): Promise<ApiEnvelope<RefreshResponseData>> {
  return ServerFetch<ApiEnvelope<RefreshResponseData>>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: input.refresh_token }),
  });
}

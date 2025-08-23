import { ServerFetch, type ApiEnvelope } from "@/actions/http";

export type SimpleOk = { ok: boolean };

/**
 * Logout current session server-side (best-effort). Client should clear tokens regardless of response.
 */
export async function logout(): Promise<ApiEnvelope<SimpleOk>> {
  return ServerFetch<ApiEnvelope<SimpleOk>>("/api/auth/logout", {
    method: "POST",
  });
}

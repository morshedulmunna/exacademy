"use server";

import FetchAPI from "@/actions/http";

/**
 * Logs out the current user by calling the backend endpoint that clears HttpOnly cookies.
 * Also returns a hint to clients to clear any non-HttpOnly client state.
 */
export async function logout(): Promise<{ ok: boolean }> {
  // Call backend to expire auth cookies (HttpOnly)
  await FetchAPI.post({ endpoint: "/api/auth/logout" });
  // The server clears cookies via Set-Cookie headers. Clients should clear local state separately.
  return { ok: true };
}

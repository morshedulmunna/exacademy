"use server";

import FetchAPI from "@/actions/http";

type RegisterPayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

/**
 * Register a new user via backend API.
 * Returns API response with `{ data: { id } }` on success.
 */
export async function registerAction(payload: RegisterPayload) {
  try {
    return FetchAPI.post({ endpoint: "/api/auth/register", body: payload });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

import { ServerFetch } from "@/actions/http";

export type LoginInput = { email: string; password: string };

export type LoginResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      first_name: string | null;
      last_name: string | null;
      full_name: string | null;
      avatar_url: string | null;
      is_active: boolean;
      is_blocked: boolean;
    };
  };
};

/**
 * Login with email and password.
 */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await ServerFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
  return res;
}

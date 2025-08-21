import { ServerFetch } from "@/actions/http";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

export type LoginResponse = {
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

/**
 * Register a new user, then perform login to obtain tokens and user payload.
 * Returns the login response on success.
 */
export async function register(input: RegisterInput): Promise<LoginResponse> {
  // Create account
  await ServerFetch<{ id: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      username: input.username,
      password: input.password,
    }),
  });

  // Auto-login to fetch tokens
  const loginRes = await ServerFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });

  return loginRes;
}

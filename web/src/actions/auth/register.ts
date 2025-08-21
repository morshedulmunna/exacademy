import { ServerFetch } from "@/actions/http";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

export type RegisterResponse = { id: string };

/**
 * Register a new user. Does not login.
 * Returns the created user id.
 */
export async function register(input: RegisterInput): Promise<RegisterResponse> {
  const res = await ServerFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      username: input.username,
      password: input.password,
    }),
  });
  return res;
}

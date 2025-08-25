"use server";

import FetchAPI from "@/actions/http";

type GithubLoginPayload = {
  code: string;
};

/**
 * Exchange a GitHub OAuth code for our API tokens and set auth cookies.
 */
export async function githubLoginAction(payload: GithubLoginPayload) {
  const response = await FetchAPI.post({
    endpoint: "/api/auth/github",
    body: payload,
  });

  return response;
}

import { NextResponse } from "next/server";
import { githubLoginAction } from "@/actions/auth/github.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body?.code;
    if (!code || typeof code !== "string") {
      return NextResponse.json({ message: "Missing code" }, { status: 400 });
    }

    const result = await githubLoginAction({ code });
    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "GitHub login failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}

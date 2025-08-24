import { NextResponse } from "next/server";
import { googleLoginAction } from "@/actions/auth/google.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id_token = body?.id_token;
    if (!id_token || typeof id_token !== "string") {
      return NextResponse.json({ message: "Missing id_token" }, { status: 400 });
    }

    const result = await googleLoginAction({ id_token });

    // Ensure cookies are set on this response as well
    const res = NextResponse.json(result);
    try {
      const data: any = (result as any)?.data ?? result;
      const accessToken: string | undefined = data?.access_token;
      const refreshToken: string | undefined = data?.refresh_token;
      const tokenType: string | undefined = data?.token_type;
      const expiresIn: number | undefined = data?.expires_in;
      const oneHour = 60 * 60;
      const thirtyDays = 60 * 60 * 24 * 30;
      const isProd = process.env.NODE_ENV === "production";

      if (accessToken) {
        res.cookies.set("access_token", accessToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: typeof expiresIn === "number" ? expiresIn : oneHour,
        });
      }

      if (refreshToken) {
        res.cookies.set("refresh_token", refreshToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: thirtyDays,
        });
      }

      if (tokenType) {
        res.cookies.set("token_type", tokenType, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: thirtyDays,
        });
      }
    } catch {}

    return res;
  } catch (error: any) {
    const message = error?.message || "Google login failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}

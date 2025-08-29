import { NextResponse } from "next/server";

export default function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("access_token")?.value;
  console.log("authtoken ============", authCookie);

  return NextResponse.next();
}

export const config = {
  matcher: [],
};

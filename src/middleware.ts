import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  if (accessToken && refreshToken && url.pathname === "/") {
    await createSession({ accessToken, refreshToken });

    // Remove access_token from URL
    url.searchParams.delete("access_token");
    url.searchParams.delete("refresh_token");

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

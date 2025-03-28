import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import cookie from "cookie";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/api/", "/favicon.ico", "/_next/", 'admin/onboarding', 'school_admin/onboarding'];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // Parse cookies
  const cookies = req.headers.get("cookie") || "";
  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.token;
  console.log(token, "token");

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Since we can't verify the token here, allow the request to proceed
  return NextResponse.next();
}

// Specify the matcher to apply middleware to specific routes
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

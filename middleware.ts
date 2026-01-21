import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  console.log('Page Load Request');


  const accessToken = req.cookies.get("access")?.value;
  const role = req.cookies.get("role")?.value; // optional, you could drop this and rely on /me

  const { pathname } = req.nextUrl;

  const publicPaths = ["/signin", "/signup"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!accessToken && !isPublic) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403wwwwwww", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};

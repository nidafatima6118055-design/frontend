import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const access = request.cookies.get("access")?.value;
    const refresh = request.cookies.get("refresh")?.value;

    const publicPaths = [
        "/signin",
        "/signup",
        "/forgot-password",
        "/reset-password",
    ];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    // ✅ Case 1: No tokens & not a public route → redirect to signin
    if (!access && !refresh && !isPublic) {
        const loginUrl = new URL("/signin", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ✅ Case 2: Decode access token (if present)
    let isExpired = false;
    if (access) {
        try {
            const payload = JSON.parse(
                Buffer.from(access.split(".")[1], "base64").toString()
            );
            const exp = payload.exp * 1000;
            if (Date.now() > exp) {
                isExpired = true;
            }
        } catch {
            isExpired = true;
        }
    } else if (refresh) {
        isExpired = true; // no access token → try refresh
    }

    // ✅ Case 3: If access expired but refresh available → silently refresh
    if (isExpired && refresh) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/auth/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (res.ok) {
                const data = await res.json();
                const newAccess = data?.data?.access;
                const newRefresh = data?.data?.refresh;

                const response = NextResponse.next();

                // ✅ Update cookies
                if (newAccess) {
                    response.cookies.set("access", newAccess, {
                        path: "/",
                        httpOnly: true,
                        sameSite: "Lax",
                    });
                }
                if (newRefresh) {
                    response.cookies.set("refresh", newRefresh, {
                        path: "/",
                        httpOnly: true,
                        sameSite: "Lax",
                    });
                }

                console.log("🔁 Token auto-refreshed in middleware");
                return response;
            } else {
                console.warn("⚠️ Refresh failed — forcing logout");
                const response = NextResponse.redirect(new URL("/signin", request.url));
                response.cookies.delete("access");
                response.cookies.delete("refresh");
                return response;
            }
        } catch (err) {
            console.error("❌ Error refreshing token:", err);
            const response = NextResponse.redirect(new URL("/signin", request.url));
            response.cookies.delete("access");
            response.cookies.delete("refresh");
            return response;
        }
    }

    // ✅ Case 4: Logged-in user visiting /signin → redirect home
    if (access && pathname.startsWith("/signin")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ✅ Allow everything else
    return NextResponse.next();
}

// ✅ Exclude static files, API routes, Next.js internals
export const config = {
    matcher: [
        // "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg|css|js)$).*)",
    ],
};

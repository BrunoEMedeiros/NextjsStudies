import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as setCookieParser from "set-cookie-parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Ideally, you would decode the authToken here (e.g., using `jose`) to check if it's expired.
  // For simplicity, we trigger a refresh if the authToken is missing but a refreshToken exists.
  const needsRefresh = !authToken && refreshToken;

  // Create a response object early so we can attach cookies to it if needed
  let response = NextResponse.next();

  if (needsRefresh) {
    try {
      const refreshResponse = await fetch(
        `${BASE_URL}/accounts/sessions/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (refreshResponse.ok) {
        const setCookieHeader = refreshResponse.headers.get("set-cookie");

        if (setCookieHeader) {
          const parsedCookies = setCookieParser.parse(setCookieHeader, {
            decodeValues: false,
          });

          parsedCookies.forEach((cookie) => {
            const cookieOptions = {
              maxAge: cookie.maxAge,
              expires: cookie.expires,
              path: cookie.path || "/",
              domain: cookie.domain,
              secure: cookie.secure,
              httpOnly: cookie.httpOnly,
              sameSite: cookie.sameSite as "lax" | "strict" | "none",
            };

            // 1. Forward the new cookie to the incoming request
            // so Server Components calling `cookies()` see the updated token immediately.
            request.cookies.set(cookie.name, cookie.value);

            // We must recreate the NextResponse after modifying the request cookies
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });

            // 2. Attach the new cookie to the outgoing response
            // so the user's browser actually saves it.
            response.cookies.set(cookie.name, cookie.value, cookieOptions);
          });
        }
      } else {
        // If the refresh token is also invalid/expired, wipe the cookies and redirect to login
        response.cookies.delete("authToken");
        response.cookies.delete("refreshToken");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("[Middleware] Token refresh failed:", error);
    }
  }

  return response;
}

// Configure the paths where this middleware should run
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

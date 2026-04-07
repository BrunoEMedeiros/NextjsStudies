import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as setCookieParser from "set-cookie-parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

async function fetchNewTokens(refreshToken: string): Promise<string[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/accounts/sessions/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (response.ok) {
      // 2. USE getSetCookie() HERE! This correctly returns an array of individual cookies
      return response.headers.getSetCookie();
    }
    return null;
  } catch (error) {
    console.error("[Middleware] Network error during token refresh:", error);
    return null;
  }
}

function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64;

    const decoded = JSON.parse(atob(paddedBase64));
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch (error) {
    console.error("[Middleware] Failed to decode JWT:", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  // Add a 10-second buffer to account for clock skew / network latency
  return Date.now() / 1000 >= exp - 10;
}

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // ✅ THE KEY CHANGE: refresh if token is absent OR expired
  const needsRefresh =
    refreshToken && (!authToken || isTokenExpired(authToken));

  if (needsRefresh) {
    const setCookieHeaders = await fetchNewTokens(refreshToken);

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeaders, {
        decodeValues: false,
      });

      // 1. Update the NextRequest's internal cookie store directly
      parsedCookies.forEach((cookie) => {
        request.cookies.set(cookie.name, cookie.value);
      });

      // 2. Clone headers and use the UPDATED cookie store to generate the string
      // This prevents the "authToken=OLD; authToken=NEW" duplication bug
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("cookie", request.cookies.toString());

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 3. Write new tokens into the browser's cookies
      parsedCookies.forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          path: cookie.path || "/",
          domain: cookie.domain,
          secure: process.env.NODE_ENV === "production" ? cookie.secure : false,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite as "lax" | "strict" | "none",
        });
      });

      return response;
    }

    // Refresh token is also invalid → force sign-in
    const redirectResponse = NextResponse.redirect(
      new URL("/signin", request.url)
    );
    redirectResponse.cookies.delete("authToken");
    redirectResponse.cookies.delete("refreshToken");
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

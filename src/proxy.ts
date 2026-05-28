import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as setCookieParser from "set-cookie-parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

//Futuramente no site ------------------------------------------------------

// const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
//   administrative: [
//     "/dashboard/activities",
//     "/dashboard/members",
//     "/dashboard/reports",
//   ],
//   maintainer: ["/dashboard/activities", "/dashboard/members"],
//   regular: ["/dashboard/activities"],
// };

function getTokenRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const decoded = JSON.parse(
      atob(pad ? base64 + "=".repeat(4 - pad) : base64)
    );
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

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
  return Date.now() / 1000 >= exp - 10;
}

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const needsRefresh =
    refreshToken && (!authToken || isTokenExpired(authToken));

  if (needsRefresh) {
    const setCookieHeaders = await fetchNewTokens(refreshToken);

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeaders, {
        decodeValues: false,
      });

      parsedCookies.forEach((cookie) => {
        request.cookies.set(cookie.name, cookie.value);
      });

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("cookie", request.cookies.toString());

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

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

    const redirectResponse = NextResponse.redirect(
      new URL("/signin", request.url)
    );

    redirectResponse.cookies.delete("authToken");
    redirectResponse.cookies.delete("refreshToken");
    return redirectResponse;
  }

  // Futuramente no site

  // const currentAuthToken = request.cookies.get("authToken")?.value;
  // if (currentAuthToken) {
  //   const role = getTokenRole(currentAuthToken);
  //   const pathname = request.nextUrl.pathname;

  //   const allowed = ROLE_ALLOWED_PATHS[role ?? ""] ?? [];
  //   const isProtectedDashboard = pathname.startsWith("/dashboard");
  //   const canAccess = allowed.some((p) => pathname.startsWith(p));

  //   if (isProtectedDashboard && !canAccess) {
  //     return NextResponse.redirect(
  //       new URL("/dashboard/activities", request.url)
  //     );
  //   }

  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

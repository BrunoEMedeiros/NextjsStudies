import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as setCookieParser from "set-cookie-parser";
import { ApiError } from "./ApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// A typed sentinel so callers can re-throw it cleanly
export class AuthExpiredError extends Error {
  constructor() {
    super("SESSION_EXPIRED");
    this.name = "AuthExpiredError";
  }
}

async function applySetCookies(
  setCookieHeaders: string[],
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  if (!setCookieHeaders?.length) return;
  try {
    const parsed = setCookieParser.parse(setCookieHeaders, {
      decodeValues: false,
    });
    parsed.forEach((cookie) => {
      cookieStore.set({
        name: cookie.name,
        value: cookie.value,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
        path: cookie.path || "/",
        secure: process.env.NODE_ENV === "production" ? cookie.secure : false,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite as "lax" | "strict" | "none",
      });
    });
  } catch {
    console.warn("[apiFetch] Cannot set cookies in this context.");
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<{ data: T; headers: Record<string, string> }> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value || "";

  const buildOptions = (token: string): RequestInit => ({
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  let response = await fetch(url, buildOptions(authToken));

  // --- 1. REACTIVE REFRESH INTERCEPTOR ---
  if (response.status === 401 && !_isRetry && !url.includes("/refresh")) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
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
        // Persist new token pair into the cookie store
        const newCookies = refreshResponse.headers.getSetCookie();
        await applySetCookies(newCookies, cookieStore);

        // Extract the new authToken for the immediate retry
        const parsed = setCookieParser.parse(newCookies, {
          decodeValues: false,
        });
        const newAuthToken =
          parsed.find((c) => c.name === "authToken")?.value || "";

        // Retry the original request with the new token
        response = await fetch(url, buildOptions(newAuthToken));
      } else {
        // Refresh token is also dead → clear cookies and bounce to signin
        cookieStore.delete("authToken");
        cookieStore.delete("refreshToken");
        // ⚠️  redirect() MUST NOT be inside a try/catch in your caller
        redirect("/signin");
      }
    } else {
      // No refresh token at all → treat as logged out
      redirect("/signin");
    }
  }

  // --- 2. ERROR HANDLING ---
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData);
  }

  const data = await response.json().catch(() => null);

  // --- 3. COOKIE SAVING (for login and token refresh) ---
  await applySetCookies(response.headers.getSetCookie(), cookieStore);

  const headersObject: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      headersObject[key] = value;
    }
  });

  return { data, headers: headersObject };
}

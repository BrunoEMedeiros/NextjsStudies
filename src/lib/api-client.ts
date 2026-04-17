// apiFetch.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as setCookieParser from "set-cookie-parser";
import { ApiError } from "./ApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const AUTH_ROUTES = ["/accounts/sessions/signin", "/accounts/sessions/signup"];

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

  const buildOptions = (token: string): RequestInit => {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return {
      ...options,
      headers,
    };
  };

  let response = await fetch(url, buildOptions(authToken));

  if (
    response.status === 401 &&
    !_isRetry &&
    !url.includes("/refresh") &&
    !AUTH_ROUTES.some((route) => url.includes(route))
  ) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      redirect("/signin");
    }

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
      const newCookies = refreshResponse.headers.getSetCookie();
      await applySetCookies(newCookies, cookieStore);
      const parsed = setCookieParser.parse(newCookies, { decodeValues: false });
      const newAuthToken =
        parsed.find((c) => c.name === "authToken")?.value || "";
      response = await fetch(url, buildOptions(newAuthToken));
    } else {
      cookieStore.delete("authToken");
      cookieStore.delete("refreshToken");
      redirect("/signin");
    }
  }

  const data = await response.json().catch(() => null);
  await applySetCookies(response.headers.getSetCookie(), cookieStore);

  const headersObject: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") headersObject[key] = value;
  });

  if (!response.ok) {
    console.log(response);
    throw new ApiError(response.status, data);
  }

  return { data, headers: headersObject };
}

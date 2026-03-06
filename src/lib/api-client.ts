import { cookies } from "next/headers";
import { ApiError } from "./ApiError";
import * as setCookieParser from "set-cookie-parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

let isRefreshing = false;

async function registerCookies(response_headers: Headers) {
  const setCookieHeader = response_headers.get("set-cookie");

  if (setCookieHeader) {
    const parsedCookies = setCookieParser.parse(setCookieHeader, {
      decodeValues: false,
    });

    for (const cookie of parsedCookies) {
      const cookieOptions: Partial<{
        maxAge: number;
        expires: Date;
        path: string;
        domain: string;
        secure: boolean;
        httpOnly: boolean;
        sameSite: "lax" | "strict" | "none";
      }> = {};

      const cookieStore = await cookies();

      if (cookie.maxAge !== undefined) cookieOptions.maxAge = cookie.maxAge;
      if (cookie.expires) cookieOptions.expires = cookie.expires;
      if (cookie.path) cookieOptions.path = cookie.path;
      if (cookie.domain) cookieOptions.domain = cookie.domain;
      if (cookie.secure) cookieOptions.secure = cookie.secure;
      if (cookie.httpOnly) cookieOptions.httpOnly = cookie.httpOnly;

      cookieStore.set(cookie.name, cookie.value, cookieOptions);
    }
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; headers: Record<string, string> }> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";

  let fecthOptions = {};

  fecthOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  let response = await fetch(url, fecthOptions);

  if (response.status === 401) {
    if (isRefreshing) {
      try {
        return apiFetch<T>(endpoint, options);
      } catch (err) {
        throw err;
      }
    }

    isRefreshing = true;

    console.log(refreshToken);

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

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json().catch(() => ({}));
        throw new ApiError(refreshResponse.status, errorData);
      }

      await registerCookies(refreshResponse.headers);

      return apiFetch<T>(endpoint, options);
    } catch (refreshError: any) {
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json();
  const headers = Object.fromEntries(response.headers.entries());

  if (!isRefreshing) {
    await registerCookies(response.headers);
  }

  return { data, headers };
}

// apiFetch.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as setCookieParser from "set-cookie-parser";
import { ApiError } from "./ApiError";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const AUTH_ROUTES = ["/accounts/sessions/signin", "/accounts/sessions/signup"];

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

type RefreshResult =
  | { ok: true; newAuthToken: string; setCookies: string[] }
  | { ok: false };

// The backend rotates+invalidates the refresh token on use, so concurrent
// requests racing on the same stale refresh token must share a single
// in-flight refresh instead of each calling /refresh independently.
const inFlightRefreshes = new Map<string, Promise<RefreshResult>>();

function refreshSession(refreshToken: string): Promise<RefreshResult> {
  const existing = inFlightRefreshes.get(refreshToken);
  if (existing) return existing;

  const promise = (async (): Promise<RefreshResult> => {
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
      return { ok: false };
    }

    const setCookies = refreshResponse.headers.getSetCookie();
    const parsed = setCookieParser.parse(setCookies, { decodeValues: false });
    const newAuthToken = parsed.find((c) => c.name === "authToken")?.value || "";
    return { ok: true, newAuthToken, setCookies };
  })();

  inFlightRefreshes.set(refreshToken, promise);
  promise.finally(() => inFlightRefreshes.delete(refreshToken));

  return promise;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
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
    !url.includes("/refresh") &&
    !AUTH_ROUTES.some((route) => url.includes(route))
  ) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      redirect("/signin");
    }

    const result = await refreshSession(refreshToken);

    if (result.ok) {
      await applySetCookies(result.setCookies, cookieStore);
      response = await fetch(url, buildOptions(result.newAuthToken));
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
    // console.log(response);
    throw new ApiError(response.status, data);
  }

  return { data, headers: headersObject };
}

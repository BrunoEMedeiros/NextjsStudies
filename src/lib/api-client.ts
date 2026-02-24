"use client";

import type { AppStore } from "@/src/lib/store";
import { logOff, signin } from "./feature/auth/authSlice";
import { ApiError } from "./ApiError";

type QueueItem = {
  resolve: () => void;
  reject: (error: any) => void;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

let store: AppStore | undefined;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const handleLogout = async () => {
  if (!store) return;
  store.dispatch(logOff());

  try {
    await fetch(`${BASE_URL}/accounts/sessions/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Logout call failed", e);
  }

  window.location.href = "/login";
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; headers: Record<string, string> }> {
  if (!store) {
    throw new Error("Redux store not injected into API client.");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    if (isRefreshing) {
      try {
        await new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        return apiFetch<T>(endpoint, options);
      } catch (err) {
        throw err;
      }
    }

    const isRefreshEndpoint = endpoint.includes("/accounts/sessions/refresh");
    const isSigninEndpoint = endpoint.includes("/accounts/sessions/signin");

    if (isRefreshEndpoint || isSigninEndpoint) {
      if (isRefreshEndpoint) handleLogout();
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(401, errorBody);
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${BASE_URL}/accounts/sessions/refresh`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json().catch(() => ({}));
        throw new ApiError(refreshResponse.status, errorData);
      }

      store.dispatch(signin({ isLoged: true }));

      processQueue(null);

      return apiFetch<T>(endpoint, options);
    } catch (refreshError: any) {
      processQueue(refreshError);
      handleLogout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json();
  const headers = Object.fromEntries(response.headers.entries());

  return { data, headers };
}

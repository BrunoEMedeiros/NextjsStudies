"use client";

// 1. Change import to get the TYPE only
import type { AppStore } from "@/src/lib/store";
// import { showSnackbar } from "@/lib/features/snack/snackSlice";
import { logOff, signin } from "./feature/auth/authSlice";

// ... keep your imports ...

type QueueItem = {
  resolve: (token: string) => void; // Function to resume the request successfully
  reject: (error: any) => void; // Function to crash the request if refresh fails
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://zenprojectapi.onrender.com";

let store: AppStore | undefined;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  if (!store) return;
  store.dispatch(logOff());
  window.location.href = "/login";
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!store) {
    throw new Error(
      "Redux store not injected into API client. Ensure StoreProvider renders."
    );
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const state = store.getState();
  const token = state.auth.authToken;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  } as HeadersInit;

  let response = await fetch(url, { ...options, headers });

  // 4. Handle 401 (Token Rotation)
  if (response.status === 401) {
    if (isRefreshing) {
      try {
        // As novas requisições entrando em paralelo a uma primeira feita
        // que atribuiu isRefreshing = true vão ficar pausadas até que ela seja
        // concluida
        // Quando concluida ele vai "resolver" todas elas com o novo token
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        return apiFetch<T>(endpoint, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      } catch (err) {
        throw err;
      }
    }

    const isRefreshEndpoint = endpoint.includes("/accounts/sessions/refresh");
    const isSigninEndpoint = endpoint.includes("/accounts/sessions/signin");

    if (isRefreshEndpoint || isSigninEndpoint) {
      if (isRefreshEndpoint) handleLogout();
      const errorBody = await response.json().catch(() => ({}));
      throw { status: 401, ...errorBody };
    }

    isRefreshing = true;

    try {
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) throw new Error("No refresh token");

      const refreshResponse = await fetch(
        `${BASE_URL}/accounts/sessions/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!refreshResponse.ok) throw new Error("Refresh failed");
      const data = await refreshResponse.json();

      store.dispatch(
        signin({
          authToken: data.authToken,
          refreshToken: data.refreshToken,
          isLoged: true,
        })
      );

      processQueue(null, data.authToken);

      return apiFetch<T>(endpoint, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${data.authToken}` },
      });
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      handleLogout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  // 5. Handle Global Errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const backendMessage = errorData?.message;

    if (response.status === 409) {
      //   store.dispatch(
      //     showSnackbar({
      //       message: backendMessage || "Conflito de dados (409)",
      //       open: true,
      //       severity: "warning",
      //     })
      //   );
    } else if (response.status === 401 && endpoint.includes("/signin")) {
      //   store.dispatch(
      //     showSnackbar({
      //       message: "Email ou senha incorreta(s)",
      //       open: true,
      //       severity: "info",
      //     })
      //   );
    } else if (response.status >= 500) {
      //   store.dispatch(
      //     showSnackbar({
      //       message: "Erro interno do servidor",
      //       open: true,
      //       severity: "error",
      //     })
      //   );
    }

    throw { status: response.status, data: errorData };
  }

  return response.json();
}

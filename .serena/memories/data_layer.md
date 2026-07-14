# Data Layer

All backend calls go through `apiFetch<T>(endpoint, options)` in `src/lib/api-client.ts`, a `"use server"`-context helper (uses `next/headers` cookies). It:
- Reads `authToken` cookie, attaches `Authorization: Bearer`.
- On 401 (excluding refresh/auth routes), transparently calls `/accounts/sessions/refresh` with the `refreshToken` cookie, re-applies `Set-Cookie` via `set-cookie-parser`, retries original request once.
- Redirects to `/signin` if refresh fails or no refresh token exists.
- Throws `ApiError` (`src/lib/ApiError.ts`, carries `status` + backend `data`) on non-OK responses; check with `isApiError()`.

`src/lib/service/*.service.ts` (`activity.service.ts`, `schedule.service.ts`, `filter.service.ts`, `user.service.ts`) are `"use server"` modules — each exported fn is a server action calling `apiFetch`, returns typed data.
**Convention: any new backend integration adds a function to the relevant `*.service.ts`, never a client-side `fetch`.**

## State management
- `src/lib/store.ts` combines `authSlice`, `scheduleSlice`, `filterSlice`. Wrapped via `StoreProvider` (creates store once per mount with `useRef`).
- `ReactQueryProvider` wraps the whole app in `src/app/layout.tsx`, order: `ReactQueryProvider` > `StoreProvider` > children. Used by client components (e.g. calendar views) via `useQuery`, calling `*.service.ts` server actions as `queryFn`.
- Redux slices hold client-only state (auth session mirror, in-progress schedule items, active filters) — NOT source of truth for server data (that's React Query's cache).

## Error handling
Backend errors surface as `ApiError` (status + `data.message`/`data.code`). Catch and check with `isApiError(error)`, don't duck-type. User-facing errors shown via `sonner` (`<Toaster richColors position="top-right" />` in root layout).

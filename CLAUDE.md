# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, Turbopack default)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test runner configured in this project (no test script, no test files/framework present). Don't assume Jest/Vitest exist.

## Architecture

Next.js 16 (App Router) + React 19 admin dashboard for "zenrp", written in Portuguese (pt-BR) in user-facing strings. Path alias `@/*` maps to the repo root, so imports look like `@/src/lib/...` and `@/src/components/...`.

### Route groups

- `src/app/(auth)/` — `signin`, `register`, unauthenticated layout.
- `src/app/(admin)/dashboard/` — `activities`, `members`, `reports`, `schedules`; wrapped by `DashBoardNavBar` in `(admin)/layout.tsx`.
- `src/app/api/auth/logout/route.ts` — the only route handler; auth otherwise flows through server actions, not API routes.
- There is no `middleware.ts`. Auth/redirect-on-expiry logic lives inside `apiFetch` (see below), not in Next.js middleware.

### Data layer: server actions + apiFetch, not client-side fetch

`src/lib/api-client.ts` exports `apiFetch<T>(endpoint, options)`, a `"use server"`-context helper (uses `next/headers` cookies) that ALL backend calls go through. It:
- Reads `authToken` from cookies and attaches `Authorization: Bearer`.
- On a 401 (excluding refresh/auth routes), transparently calls `/accounts/sessions/refresh` with the `refreshToken` cookie, re-applies `Set-Cookie` headers via `set-cookie-parser`, and retries the original request once.
- Redirects to `/signin` if refresh fails or no refresh token exists.
- Throws `ApiError` (from `src/lib/ApiError.ts`, carrying `status` + backend error `data`) on non-OK responses; check with `isApiError()`.

`src/lib/service/*.service.ts` (`activity.service.ts`, `schedule.service.ts`, `filter.service.ts`, `user.service.ts`) are `"use server"` modules — each exported function is a server action that calls `apiFetch` and returns typed data. This is the pattern to follow for any new backend integration: add a function to the relevant `*.service.ts`, not a client-side `fetch`.

### State: Redux Toolkit (client UI state) + TanStack Query (server state)

- `src/lib/store.ts` combines `authSlice`, `scheduleSlice`, `filterSlice` (`src/lib/feature/<name>/<name>Slice.ts`). Wrapped via `StoreProvider` (creates the store once per mount with `useRef`).
- `ReactQueryProvider` wraps the whole app in `src/app/layout.tsx` (order: `ReactQueryProvider` > `StoreProvider` > children) for data fetched from client components (e.g. calendar views) via `useQuery`, calling the `*.service.ts` server actions as `queryFn`.
- Redux slices hold client-only state (auth session mirror, in-progress schedule items, active filters) — they are not the source of truth for server data, which lives in React Query's cache.

### Forms & validation

- `react-hook-form` + `@hookform/resolvers` zod resolver, validated against schemas in `src/lib/schemas/*.schema.ts` (zod v4 syntax, e.g. `z.int()`, `z.url()`). Validation messages are written in Portuguese.
- Schema files are the source of truth for a form's shape; infer types with `z.infer<typeof schema>` rather than hand-writing duplicate interfaces.

### Components

- `src/components/ui/` is shadcn/ui (`components.json`: style `radix-nova`, baseColor `neutral`, icon library `lucide`, RSC on). Add new primitives with the shadcn CLI conventions rather than hand-rolling — aliases are `@/src/components`, `@/src/components/ui`, `@/src/lib`.
- Feature components follow a `ComponentName/ComponentName.tsx` + `useComponentName.ts` hook split when there's non-trivial logic (e.g. `SchedulesCalendar/SchedulesCalendar.tsx` + `useSchedulesCalendar.ts`), keeping data-fetching/state logic out of the render tree.
- Calendar UI (`react-big-calendar`) is used for scheduling views; event colors are keyed by activity `type` (`event`/`course`/`ceremony`).

### Styling

Tailwind v4 (CSS-based config, no `tailwind.config.ts`) via `src/globals.css`, importing `shadcn/tailwind.css` and layering custom brand color tokens (`--midnight-black`, `--earth-yellow`, etc.) onto shadcn's semantic CSS variables (`--background`, `--primary`, ...). Dark-mode variant is `@custom-variant dark (&:is(.dark *))`. Prefer using the semantic tokens/utility classes over the raw brand variables in components.

### Error handling convention

Backend errors surface as `ApiError` (status + structured `data.message`/`data.code`). Catch and check with `isApiError(error)` rather than duck-typing; user-facing errors are shown via `sonner` (`<Toaster richColors position="top-right" />` mounted in root layout).

### Backend dependency

This app is the frontend for a separate NestJS API — `zenrp_nest`, a sibling repo at `/Users/brunoeduardomedeiros/Desktop/MyStuffs/zenrp/zenrp_nest` (added to this session via `--add-dir`, not a subdirectory of this repo). All `apiFetch`/`*.service.ts` calls target that backend.

- Stack: NestJS 11, Prisma 6 (`@prisma/adapter-pg` against Postgres), `@nestjs/jwt` + `passport-jwt`/`passport-local` for auth, `@nestjs/throttler`, S3 via `@aws-sdk/client-s3`, `zod` for validation.
- Scripts: `npm run start:dev` (watch), `npm run build`, `npm run test` / `test:e2e` (Vitest — unlike this repo, the backend does have a test suite), `npm run lint`.
- The `authToken`/`refreshToken` cookie contract and `/accounts/sessions/refresh` endpoint that `apiFetch` (see above) relies on are defined by this backend — check there when refresh/auth behavior needs to change.

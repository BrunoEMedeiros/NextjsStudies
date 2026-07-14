# Core

Next.js 16 (App Router) + React 19 admin dashboard for "zenrp". User-facing strings are pt-BR.
Path alias `@/*` -> repo root (e.g. `@/src/lib/...`, `@/src/components/...`).

No test runner configured (no test script/framework). Don't assume Jest/Vitest.

## Source map
- `src/app/(auth)/` — signin, register; unauthenticated layout.
- `src/app/(admin)/dashboard/` — activities, members, reports, schedules; wrapped by DashBoardNavBar in `(admin)/layout.tsx`.
- `src/app/api/auth/logout/route.ts` — only route handler; all other backend access is via server actions.
- No `middleware.ts` — auth/redirect-on-expiry logic lives in `apiFetch`, not Next.js middleware.
- `src/components/` — feature components, `src/components/ui/` is shadcn/ui.
- `src/lib/service/*.service.ts` — server actions calling the backend (see `mem:data_layer`).
- `src/lib/feature/<name>/<name>Slice.ts` — Redux slices (auth, filter, schedule).
- `src/lib/schemas/*.schema.ts` — zod v4 validation schemas, source of truth for form shapes.

## Further memories
- `mem:tech_stack` — deps, versions, package manager.
- `mem:data_layer` — apiFetch/server-action pattern, state management (Redux + TanStack Query).
- `mem:conventions` — forms/validation, component structure, styling.
- `mem:suggested_commands` — dev/build/lint commands.
- `mem:task_completion` — what to run before considering a task done.

# Tech Stack

- Next.js 16.1.6 (App Router, Turbopack default for `dev`), React 19.2.3.
- TypeScript ^5, ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript).
- Tailwind v4, CSS-based config (no `tailwind.config.ts`) — see `mem:conventions` for styling details.
- State: `@reduxjs/toolkit` + `react-redux` (client UI state), `@tanstack/react-query` (server state).
- Forms: `react-hook-form` + `@hookform/resolvers` (zod v4 resolver).
- UI: shadcn/ui (`radix-ui`, `lucide-react`), `react-big-calendar` for scheduling views, `sonner` for toasts.
- Misc: `date-fns`, `js-cookie`, `set-cookie-parser`, `libphonenumber-js`/`react-input-mask` for phone fields, `lodash-es`.
- Package manager: npm (package-lock.json based scripts; no yarn/pnpm lockfile).

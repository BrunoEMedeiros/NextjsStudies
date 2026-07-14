# Conventions

## Forms & validation
- `react-hook-form` + `@hookform/resolvers` zod resolver, schemas in `src/lib/schemas/*.schema.ts` (zod v4 syntax, e.g. `z.int()`, `z.url()`). Validation messages in Portuguese.
- Infer types with `z.infer<typeof schema>` — don't hand-write duplicate interfaces; schema file is the source of truth for a form's shape.

## Components
- `src/components/ui/` is shadcn/ui (`components.json`: style `radix-nova`, baseColor `neutral`, icon lib `lucide`, RSC on). Add new primitives with shadcn CLI conventions, not hand-rolled. Aliases: `@/src/components`, `@/src/components/ui`, `@/src/lib`.
- Feature components with non-trivial logic follow a `ComponentName/ComponentName.tsx` + `useComponentName.ts` hook split (e.g. `SchedulesCalendar/SchedulesCalendar.tsx` + `useSchedulesCalendar.ts`) — keeps data-fetching/state logic out of the render tree.
- Calendar UI (`react-big-calendar`) used for scheduling views; event colors keyed by activity `type` (`event`/`course`/`ceremony`).

## Styling
Tailwind v4 (CSS-based config, no `tailwind.config.ts`) via `src/globals.css`, imports `shadcn/tailwind.css`, layers custom brand color tokens (`--midnight-black`, `--earth-yellow`, etc.) onto shadcn's semantic CSS vars (`--background`, `--primary`, ...). Dark-mode variant: `@custom-variant dark (&:is(.dark *))`. Prefer semantic tokens/utility classes over raw brand variables in components.

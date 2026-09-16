# HavenGate Panel

npm-workspaces monorepo containing two React apps and their shared packages.

## Layout

```
apps/
  control-panel/   # @havengate/control-panel  (dev: http://localhost:5173)
  org-panel/       # @havengate/org-panel      (dev: http://localhost:5174)
packages/
  api/             # @havengate/api    – fetch-based API client (createApiClient)
  types/           # @havengate/types  – shared data models / DTOs
  ui/              # @havengate/ui     – Tailwind v4 theme + shadcn/ui components
  utils/           # @havengate/utils  – shared helpers & constants
```

Packages are consumed as TypeScript source (no build step) via workspace symlinks.

## Scripts (run from repo root)

| Command                 | What it does                              |
| ----------------------- | ----------------------------------------- |
| `npm install`           | Install all workspaces                    |
| `npm run dev:control`   | Start the control panel dev server        |
| `npm run dev:org`       | Start the org panel dev server            |
| `npm run build`         | Typecheck + build every app               |
| `npm run typecheck`     | `tsc -b` across all workspaces            |
| `npm run lint`          | `oxlint` across the repo                  |
| `npm test`              | Run unit tests (Vitest)                   |
| `npm run test:watch`    | Vitest in watch mode                      |

## Adding shadcn/ui components

`packages/ui/components.json` is configured for the `@havengate/ui/*` aliases.
From `packages/ui`, run:

```sh
npx shadcn@latest add <component>
```

Then re-export it from `packages/ui/src/index.ts`.

## Tailwind

Each app's `src/index.css` imports `@havengate/ui/globals.css`, which pulls in
Tailwind, the shadcn theme tokens, and an `@source` directive so classes used
inside `packages/ui` are always generated.

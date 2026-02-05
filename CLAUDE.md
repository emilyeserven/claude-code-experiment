# CLAUDE.md

This file provides guidance for AI assistants working with the **emstack** codebase.

## Project Overview

Emstack is a full-stack TypeScript web application template built as a **pnpm monorepo**. It uses React for the frontend and Fastify for the backend, intentionally avoiding fullstack frameworks.

## Repository Structure

```
emstack/
├── packages/
│   ├── types/          # @emstack/types — Shared TypeScript type definitions
│   ├── middleware/      # @emstack/middleware — Fastify backend server (port 3001)
│   └── client/         # @emstack/client — React frontend app (port 3000)
├── .husky/             # Git hooks (pre-commit, pre-push run lint-staged)
├── docker-compose.yml  # Docker orchestration for both services
├── pnpm-workspace.yaml # Workspace definition
├── eslint.config.js    # Root ESLint config (uses @emilyeserven/eslint-config)
├── knip.json           # Unused dependency detection config
└── tsconfig.json       # Root TypeScript config (strict, ES2022, bundler resolution)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5.9, ES2022 modules |
| Frontend | React 19, Vite 7, Tailwind CSS 4, shadcn/ui + Radix |
| Routing (FE) | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Backend | Fastify 5 with JSON Schema type providers |
| API docs | @fastify/swagger + swagger-ui |
| Testing | Vitest (client), node:test (middleware), Storybook 10 |
| Package manager | pnpm 10.13.1 |
| Containerization | Docker multi-stage builds (Node 22, distroless final images) |

## Common Commands

All commands run from the repository root unless noted otherwise.

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all 3 packages concurrently (types watch, middleware, client)
pnpm build                # Build all packages (runs `pnpm run -r build`)
pnpm test                 # Run tests across all packages (runs `pnpm run -r test`)
pnpm lint                 # Lint the entire codebase with ESLint
pnpm lint:fix             # Auto-fix lint issues
pnpm storybook            # Launch Storybook for the client package (port 6006)
```

### Per-Package Commands

| Package | `dev` | `build` | `test` |
|---------|-------|---------|--------|
| **types** | `tsc --watch` | `tsc -p tsconfig.build.json` | — |
| **middleware** | `nodemon --exec tsx src/app.ts` | `tsc + tsc-alias` | `node --test` |
| **client** | `vite` | `vite build` | `vitest` |

Additional client commands:
- `pnpm --filter=@emstack/client run storybook` — Storybook dev server
- `pnpm --filter=@emstack/client run routeTree` — Regenerate TanStack Router route tree

## Architecture & Package Details

### @emstack/types

Shared type definitions consumed by both middleware and client via `workspace:*` dependency. Exports from `src/index.ts` using barrel re-exports. Zero runtime dependencies.

### @emstack/middleware

Fastify 5 server with:
- **Route structure**: `src/routes/routes.ts` is the top-level router, delegating to `./root.ts` and `./api/routes.ts` (prefixed `/api`).
- **Type-safe routes**: Uses `@fastify/type-provider-json-schema-to-ts` with `as const` schema objects for full request/response type inference.
- **Environment config**: `@fastify/env` with schema validation (see `src/services/env.ts`).
- **Path aliases**: `@/*` maps to `./src/*` (resolved at build time by `tsc-alias`).

### @emstack/client

React 19 SPA with:
- **File-based routing**: TanStack Router auto-generates `src/routeTree.gen.ts` — never edit this file manually.
- **Path alias**: `@/` maps to `./src/` (configured in `vite.config.ts`).
- **Styling**: Tailwind CSS 4 with `cn()` utility (`clsx` + `tailwind-merge`) in `src/lib/utils.ts`.
- **Dark mode**: Class-based theme switching via `ThemeProvider` context + `useTheme` hook, persisted in localStorage.
- **Component library**: shadcn/ui components with Radix primitives and `class-variance-authority`.
- **Data fetching**: TanStack Query; fetch functions live in `src/utils/fetchFunctions.ts`.

## Code Conventions

### Naming

- **Packages**: `@emstack/<name>` namespace
- **React components**: PascalCase files (e.g., `Test.tsx`, `ThemeProvider.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTheme.ts`)
- **Utilities/services**: camelCase files (e.g., `fetchFunctions.ts`, `swaggerOptions.ts`)
- **Types/interfaces**: PascalCase (e.g., `Test`, `DynamicTest`)
- **Test files**: `*.test.ts` or `*.test.tsx` suffix
- **Story files**: `*.stories.tsx` suffix

### Patterns

- **React components** use functional components with interface-typed props (not inline types). Include `data-testid` attributes for testability.
- **Fastify routes** are defined as async default-exported functions receiving `FastifyInstance`, with `as const` JSON Schema objects for type-safe request validation.
- **Context pattern**: Provider component + separate context file + custom hook (see `ThemeProvider.tsx`, `ThemeProviderContext.ts`, `useTheme.ts`).
- **Barrel exports**: The types package uses `export * from` re-exports in `index.ts`.
- **Module system**: All packages use `"type": "module"` (ESM).
- **Import style**: Use explicit `.ts`/`.tsx` extensions in import paths within the middleware package. Client uses Vite's resolution (no extensions needed).

### Linting & Formatting

- ESLint uses a custom shared config: `@emilyeserven/eslint-config`
- Pre-commit hook runs `lint-staged` via Husky, which applies `eslint --fix` to all staged files
- Pre-push hook also runs `lint-staged`
- Client and middleware additionally run tests on staged `.ts`/`.tsx`/`.js` files

### TypeScript

- Strict mode enabled globally
- `noImplicitAny: true`
- `noUncheckedSideEffectImports: true`
- Target: ES2022 with bundler module resolution
- Each package has its own `tsconfig.build.json` for production builds

## Testing

### Client (Vitest)

Two test projects configured in `vite.config.ts`:
1. **unit-tests**: jsdom environment, `*.test.{ts,tsx}` files, setup via `setupTests.js` (@testing-library/jest-dom)
2. **storybook**: Browser tests via Playwright (headless Chromium), runs Storybook story `play()` functions

### Middleware (node:test)

Uses Node's built-in test runner with `assert` module. Test files use `*.test.js` extension.

## Docker

```bash
docker compose up --build    # Build and start both services
```

- **middleware**: Exposed on port 3001
- **client**: Exposed on port 3000, depends on middleware
- Both use multi-stage builds with `node:22-bookworm-slim` base and `distroless` final images

## Important Notes

- `src/routeTree.gen.ts` is auto-generated by TanStack Router — do not edit manually
- The `@emstack/types` package must be built before middleware or client can consume its types
- When running `pnpm dev`, all three packages start concurrently (types in watch mode feeds the others)
- Environment variables are validated via `@fastify/env` schema — see `packages/middleware/src/services/env.ts`
- Dependencies between workspace packages use `workspace:*` protocol

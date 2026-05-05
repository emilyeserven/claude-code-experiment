# CLAUDE.md

This file provides guidance for AI assistants working with the **cc-experiments** codebase.

## Project Overview

cc-experiments is a frontend TypeScript web application, built as a **pnpm monorepo**. It uses React for the frontend, intentionally avoiding fullstack frameworks.

## Repository Structure

```
cc-experiments/
├── packages/
│   └── client/         # @cc-experiments/client — React frontend app (port 5173 dev / 3000 prod)
├── e2e/                # Playwright end-to-end tests
├── .github/workflows/  # CI, deploy, and Claude Code automation workflows
├── .husky/             # Git hooks (pre-commit, pre-push run lint-staged)
├── playwright.config.ts # Playwright E2E config
├── docker-compose.yml  # Docker orchestration for the client service
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
| Testing | Vitest (client), Playwright (E2E), Storybook 10 |
| Package manager | pnpm 10.13.1 |
| Containerization | Docker multi-stage builds (Node 22, distroless final images) |

## Common Commands

All commands run from the repository root unless noted otherwise.

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start the client dev server
pnpm build                # Build all packages (runs `pnpm run -r build`)
pnpm test                 # Run tests across all packages (runs `pnpm run -r test`)
pnpm lint                 # Lint the entire codebase with ESLint
pnpm lint:fix             # Auto-fix lint issues
pnpm e2e                  # Run Playwright end-to-end tests
pnpm e2e:ui               # Run Playwright E2E tests with interactive UI
pnpm knip                 # Detect unused dependencies and exports
pnpm storybook            # Launch Storybook for the client package (port 6006)
```

### Per-Package Commands

| Package | `dev` | `build` | `test` |
|---------|-------|---------|--------|
| **client** | `vite` | `vite build` | `vitest` |

Additional client commands:
- `pnpm --filter=@cc-experiments/client run storybook` — Storybook dev server
- `pnpm --filter=@cc-experiments/client run routeTree` — Regenerate TanStack Router route tree

## Architecture & Package Details

### @cc-experiments/client

React 19 SPA with:
- **File-based routing**: TanStack Router auto-generates `src/routeTree.gen.ts` — never edit this file manually.
- **Path alias**: `@/` maps to `./src/` (configured in `vite.config.ts`).
- **Styling**: Tailwind CSS 4 with `cn()` utility (`clsx` + `tailwind-merge`) in `src/lib/utils.ts`.
- **Dark mode**: Class-based theme switching via `ThemeProvider` context + `useTheme` hook, persisted in localStorage.
- **Component library**: shadcn/ui components with Radix primitives and `class-variance-authority`. If a needed shadcn component doesn't exist yet, manually install it from the [shadcn/ui website](https://ui.shadcn.com/) following their installation instructions.
- **Data fetching**: TanStack Query; fetch functions live in `src/utils/fetchFunctions.ts`.

## Code Conventions

### Naming

- **Packages**: `@cc-experiments/<name>` namespace
- **React components**: PascalCase files (e.g., `Test.tsx`, `ThemeProvider.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTheme.ts`)
- **Utilities/services**: camelCase files (e.g., `fetchFunctions.ts`)
- **Types/interfaces**: PascalCase (e.g., `Test`, `DynamicTest`)
- **Test files**: `*.test.ts` or `*.test.tsx` suffix
- **E2E test files**: `*.spec.ts` suffix (in `e2e/` directory)
- **Story files**: `*.stories.tsx` suffix

### Patterns

- **React components** use functional components with interface-typed props (not inline types). Include `data-testid` attributes for testability.
- **Storybook requirement**: All new React components must have a corresponding Storybook story file (`*.stories.tsx`). All unit tests for components should be written in the Storybook file using `play()` functions rather than in separate `*.test.tsx` files.
- **Context pattern**: Provider component + separate context file + custom hook (see `ThemeProvider.tsx`, `ThemeProviderContext.ts`, `useTheme.ts`).
- **Module system**: All packages use `"type": "module"` (ESM).
- **Import style**: Client uses Vite's resolution (no extensions needed).

### Linting & Formatting

- ESLint uses a custom shared config: `@emilyeserven/eslint-config`
- **Always run `pnpm lint:fix` before attempting manual lint fixes.** The auto-fixer handles class ordering (Tailwind), line wrapping, stylistic formatting, and many other rules automatically. Only fix remaining errors by hand after the auto-fixer has run.
- Pre-commit hook runs `lint-staged` via Husky, which applies `eslint --fix` to all staged files
- Pre-push hook also runs `lint-staged`
- Client additionally runs tests on staged `.ts`/`.tsx`/`.js` files

### TypeScript

- Strict mode enabled globally
- `noImplicitAny: true`
- `noUncheckedSideEffectImports: true`
- Target: ES2022 with bundler module resolution
- Client has its own `tsconfig.build.json` for production builds

## Testing

### Client (Vitest)

Two test projects configured in `vite.config.ts`:
1. **unit-tests**: jsdom environment, `*.test.{ts,tsx}` files, setup via `setupTests.js` (@testing-library/jest-dom)
2. **storybook**: Browser tests via Playwright (headless Chromium), runs Storybook story `play()` functions

### E2E (Playwright)

End-to-end tests live in the `e2e/` directory at the repo root. Configured via `playwright.config.ts`:
- Tests run against `http://localhost:5173` (Vite dev server, started automatically)
- Uses Chromium only
- In CI: single worker, 2 retries, `github` reporter
- Locally: parallel workers, no retries, `html` reporter
- Test files use `*.spec.ts` suffix

## Docker

```bash
docker compose up --build    # Build and start the client service
```

- **client**: Exposed on port 3000 (production via `server.js`), port 5173 during local development (`pnpm dev`)
- Uses multi-stage builds with `node:22-bookworm-slim` base and `distroless` final images

## CI/CD & Deployment

### GitHub Actions Workflows (`.github/workflows/`)

- **`ci.yml`** — Runs on all pushes and PRs. Steps: lint fix (auto-commits fixes), lint (posts warnings as PR comments), test, build, E2E tests, and knip unused code report (posted as PR comment). Playwright HTML reports are uploaded as artifacts.
- **`deploy-pages.yml`** — Deploys the built client to GitHub Pages on pushes to `main`/`master`. Sets `GITHUB_PAGES=true` env var, which configures Vite to use `/claude-code-experiment/` as the base path.
- **`claude.yml`** — Triggers Claude Code on issue comments and PR reviews.
- **`claude-code-review.yml`** — Automated code review using Claude Code.

### GitHub Pages

The client can be deployed as a static site to GitHub Pages. When `GITHUB_PAGES=true` is set during build, Vite uses `/claude-code-experiment/` as the base path instead of `/`.

## Verification Workflow

Before pushing any changes, run this sequence to ensure everything passes:

```bash
pnpm lint:fix             # 1. Auto-fix lint issues first
pnpm lint                 # 2. Check for remaining lint errors
pnpm build                # 3. Ensure the project builds
pnpm test                 # 4. Run all unit and storybook tests
pnpm e2e                  # 5. Run E2E tests (if you changed UI behavior)
pnpm knip                 # 6. Check for unused code (if you added/removed exports)
```

If step 1 changes files, stage and include those changes in your commit.

## Troubleshooting

### TanStack Router Route Tree

If routes are missing or stale after adding/renaming route files:
```bash
pnpm --filter=@cc-experiments/client run routeTree
```
This regenerates `src/routeTree.gen.ts`. Never edit this file manually.

### Playwright Browser Issues

If E2E or Storybook browser tests fail with missing browser errors:
```bash
npx playwright install --with-deps chromium
```

### Lint Failures

Always run `pnpm lint:fix` before trying to fix lint errors manually. The auto-fixer handles Tailwind class ordering, formatting, and many stylistic rules. Only fix remaining errors by hand.

### Build Failures

- Check for TypeScript errors: `npx tsc --noEmit` in the package directory
- Ensure `@/` imports resolve correctly (alias is configured in `vite.config.ts`)
- Verify all dependencies are installed: `pnpm install`

## Important Notes

- The CI pipeline must succeed before merging any changes. Verify that linting (`pnpm lint`), building (`pnpm build`), and tests (`pnpm test`) all pass.
- `src/routeTree.gen.ts` is auto-generated by TanStack Router — do not edit manually.
- Before pushing, check if `origin/master` has new commits. If it does, pull master and rebase the current branch onto it (`git fetch origin master && git rebase origin/master`) before pushing.
- Do not edit files in `node_modules/`, `dist/`, or any build output directories.
- When adding a new shadcn component, follow the installation instructions from the [shadcn/ui website](https://ui.shadcn.com/) rather than creating the component manually.
- GitHub Actions CI will auto-commit lint fixes on branches. If your push is rejected after CI runs, pull before pushing again.

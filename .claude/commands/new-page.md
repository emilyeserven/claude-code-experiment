Create a new page/route following the TanStack Router file-based routing conventions.

The route path is: $ARGUMENTS

Follow these steps:

1. Create the route file in `packages/client/src/routes/` following TanStack Router file-based conventions:
   - For `/about` -> `packages/client/src/routes/about.tsx`
   - For `/settings/profile` -> `packages/client/src/routes/settings/profile.tsx`
   - Use `createFileRoute` or `createLazyFileRoute` from `@tanstack/react-router`

2. Regenerate the route tree: `pnpm --filter=@cc-experiments/client run routeTree`

3. Create a corresponding E2E test in `e2e/` with the `*.spec.ts` suffix.

4. Run `pnpm lint:fix` followed by `pnpm build` to verify everything compiles.

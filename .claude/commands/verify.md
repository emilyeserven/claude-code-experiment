Run the full verification workflow to check that everything passes before pushing.

Execute these steps in order, stopping if any step fails:

1. Run `pnpm lint:fix` to auto-fix lint issues
2. Run `pnpm lint` to check for remaining errors
3. Run `pnpm build` to ensure the project builds
4. Run `pnpm test` to run all unit and storybook tests

Report a summary of results for each step. If lint:fix changed any files, list them.

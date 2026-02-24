Create a new React component following the project conventions.

The component name is: $ARGUMENTS

Follow these steps:

1. Create the component file at `packages/client/src/components/<ComponentName>.tsx` using:
   - Functional component with an interface for props (e.g., `interface <ComponentName>Props`)
   - Include a `data-testid` attribute on the root element
   - Use the `cn()` utility from `@/lib/utils` for conditional class names if needed
   - Use Tailwind CSS classes for styling

2. Create a Storybook story file at `packages/client/src/components/<ComponentName>.stories.tsx` with:
   - A default story
   - At least one variant story if the component accepts meaningful props
   - A `play()` function for interaction testing

3. Run `pnpm lint:fix` to ensure the files conform to the project's lint rules.

4. Run `pnpm test` to verify the storybook tests pass.

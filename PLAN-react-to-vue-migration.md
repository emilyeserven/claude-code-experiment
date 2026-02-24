# Plan: Migrate from React to Vue

## Overview

This document plans the migration of `@cc-experiments/client` from React 19 to Vue 3 (Composition API). The app is a timer/session-tracking SPA with two routes, localStorage-backed state, Tailwind CSS styling, and a Radix-based component library (shadcn/ui).

---

## Current Inventory

### Source Files (43 files total under `packages/client/src/`)

**Routes (3):**
- `routes/__root.tsx` — Root layout with nav links + SettingsPopover
- `routes/index.tsx` — Home page: timer, session management, entries table
- `routes/capture.tsx` — Capture page: directions/prompt form with localStorage

**Components (16):**
- `components/Button.tsx` — shadcn Button (CVA variants)
- `components/Checkbox.tsx` + `Checkbox.stories.tsx` — shadcn Checkbox
- `components/Input.tsx` — shadcn Input
- `components/Popover.tsx` — shadcn Popover (Radix)
- `components/Tooltip.tsx` — shadcn Tooltip (Radix)
- `components/Timer.tsx` + `Timer.test.tsx` — Stopwatch with start/stop/reset
- `components/TimerEntriesTable.tsx` + `TimerEntriesTable.stories.tsx` — TanStack Table with sorting, row selection, edit/delete dialogs
- `components/SessionName.tsx` + `SessionName.stories.tsx` — Editable session name
- `components/SessionSettingsMenu.tsx` + `SessionSettingsMenu.stories.tsx` — Session actions menu (delete, export)
- `components/SettingsPopover.tsx` + `SettingsPopover.stories.tsx` — Global settings (theme, timestamp mode, session switcher)
- `components/dialogs/AlertDialog.tsx` + `AlertDialog.stories.tsx` — shadcn AlertDialog (Radix)
- `components/dialogs/Dialog.tsx` — shadcn Dialog (Radix)
- `components/dialogs/MarkdownExportDialog.tsx` + `MarkdownExportDialog.stories.tsx` — Markdown export modal
- `components/dialogs/SessionSwitcherDialog.tsx` + `SessionSwitcherDialog.stories.tsx` — Session switcher modal
- `components/ui.ts` — Barrel re-export of all UI primitives

**Context/State (6):**
- `context/ThemeProvider.tsx` + `context/ThemeProviderContext.ts` — Theme (dark/light/system) via React Context
- `context/SessionProvider.tsx` + `context/SessionProviderContext.ts` — Session/entries state via React Context
- `context/TimestampSettingsProvider.tsx` + `context/TimestampSettingsContext.ts` — Timestamp mode setting

**Hooks (5):**
- `hooks/useTheme.ts` — Re-export from ThemeProviderContext
- `hooks/useSession.ts` — Re-export from SessionProviderContext
- `hooks/useTimestampSettings.ts` — Re-export from TimestampSettingsContext
- `hooks/useLocalStorage.ts` — Generic localStorage hook with JSON serialization
- `hooks/useIsMobile.ts` — Media query hook for responsive behavior

**Utilities (3):**
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `lib/createSafeContext.ts` — React context factory with safety checks
- `utils/formatTime.ts` — Milliseconds to MM:SS.ms formatter

**Entry Point:**
- `main.tsx` — createRoot, providers, RouterProvider

**Auto-generated:**
- `routeTree.gen.ts` — TanStack Router route tree (never edit)

### Tests

**Unit/Component (Storybook play functions):**
- `Checkbox.stories.tsx`, `SessionName.stories.tsx`, `SessionSettingsMenu.stories.tsx`
- `SettingsPopover.stories.tsx`, `TimerEntriesTable.stories.tsx`
- `AlertDialog.stories.tsx`, `MarkdownExportDialog.stories.tsx`, `SessionSwitcherDialog.stories.tsx`

**Unit (Vitest):**
- `Timer.test.tsx` — Timer component tests
- `routeTests/index.test.tsx` — Home route tests
- `routeTests/capture.test.tsx` — Capture route tests

**E2E (Playwright):**
- `e2e/home.spec.ts`, `e2e/capture.spec.ts`, `e2e/navigation.spec.ts`
- `e2e/sessions.spec.ts`, `e2e/settings.spec.ts`

### Key React-Specific Dependencies

| Dependency | Role | Vue Equivalent |
|---|---|---|
| `react`, `react-dom` | Core | `vue` |
| `@vitejs/plugin-react` | Vite JSX transform | `@vitejs/plugin-vue` |
| `@tanstack/react-router` | File-based routing | `vue-router` (or `unplugin-vue-router` for file-based) |
| `@tanstack/router-plugin` | Vite route generation | `unplugin-vue-router` |
| `radix-ui` | Headless UI primitives | `radix-vue` (community port) |
| `@tanstack/react-table` | Headless table | `@tanstack/vue-table` |
| `lucide-react` | Icons | `lucide-vue-next` |
| `class-variance-authority` | Variant styling | Same (framework-agnostic) |
| `clsx`, `tailwind-merge` | Class utilities | Same (framework-agnostic) |
| `@storybook/react-vite` | Storybook framework | `@storybook/vue3-vite` |
| `@testing-library/react` | Component testing | `@vue/test-utils` (or `@testing-library/vue`) |

### shadcn/ui Components in Use

shadcn/ui has a Vue port called **shadcn-vue** (`shadcn-vue.com`). The following shadcn components are currently used and would need to be re-installed from shadcn-vue:

- Button, Input, Checkbox
- Popover, Tooltip
- Dialog, AlertDialog

---

## Migration Strategy

### Approach: Incremental Migration (Recommended)

A big-bang rewrite is risky for a codebase of this size. However, given that this project has only **2 routes** and **~16 components**, the codebase is small enough that a full replacement is feasible and actually simpler than maintaining a mixed React+Vue state. The recommended approach:

1. Set up Vue infrastructure alongside React
2. Migrate utilities and types first (they're framework-agnostic)
3. Migrate leaf components bottom-up
4. Migrate state management (context → Vue composables/Pinia)
5. Migrate routes
6. Swap the entry point
7. Remove all React dependencies
8. Update tests and stories

---

## Detailed Migration Steps

### Phase 0: Infrastructure Setup

**0.1 — Install Vue dependencies**
```bash
pnpm --filter=@cc-experiments/client add vue vue-router
pnpm --filter=@cc-experiments/client add -D @vitejs/plugin-vue unplugin-vue-router
```

**0.2 — Update Vite config**
- Replace `@vitejs/plugin-react` with `@vitejs/plugin-vue`
- Replace `@tanstack/router-plugin` with `unplugin-vue-router`
- Keep `@tailwindcss/vite` (framework-agnostic)
- Update the test config to remove jsdom React setup

**0.3 — Update TypeScript config**
- Change `"jsx": "react-jsx"` to `"jsx": "preserve"` in `tsconfig.app.json`
- Add Vue-specific compiler options if needed
- Add `env.d.ts` with `/// <reference types="vite/client" />` and Vue SFC type declarations

**0.4 — Install shadcn-vue components**
Replace Radix-based React components with their shadcn-vue equivalents:
```bash
# Follow shadcn-vue installation: https://www.shadcn-vue.com/docs/installation/vite
npx shadcn-vue@latest init
npx shadcn-vue@latest add button input checkbox popover tooltip dialog alert-dialog
```

**0.5 — Install Vue-compatible ecosystem packages**
```bash
pnpm --filter=@cc-experiments/client add radix-vue @tanstack/vue-table lucide-vue-next
pnpm --filter=@cc-experiments/client add -D @storybook/vue3-vite @testing-library/vue @vue/test-utils
```

### Phase 1: Migrate Framework-Agnostic Code (No Changes Needed)

These files have no React imports and can be kept as-is:
- `lib/utils.ts` — `cn()` utility
- `utils/formatTime.ts` — Time formatting

### Phase 2: Migrate State Management (Context → Vue Composables)

React Context + hooks → Vue `provide`/`inject` composables or Pinia stores.

**2.1 — Convert `useLocalStorage` hook → Vue composable**
- React: `useState` + `useCallback` with localStorage sync
- Vue: `ref()` + `watch()` with localStorage sync (or use `@vueuse/core`'s `useLocalStorage`)

**2.2 — Convert `useIsMobile` hook → Vue composable**
- React: `useState` + `useEffect` with `matchMedia`
- Vue: `ref()` + `onMounted`/`onUnmounted` with `matchMedia` (or use `@vueuse/core`'s `useMediaQuery`)

**2.3 — Convert `ThemeProvider` → Vue composable/plugin**
- React: Context Provider wrapping children, `useTheme()` hook
- Vue: `provide()`/`inject()` pattern in a composable, or a Vue plugin. Could also use Pinia.

**2.4 — Convert `SessionProvider` → Vue composable/plugin**
- React: Context Provider with `useMemo`, `useCallback` for memoized operations
- Vue: `reactive()`/`computed()` composable with `provide()`/`inject()`. Pinia is a strong option here since session state is complex.

**2.5 — Convert `TimestampSettingsProvider` → Vue composable/plugin**
- Same pattern as ThemeProvider

**2.6 — Delete `createSafeContext.ts`**
- This React-specific utility has no Vue equivalent (Vue's `inject()` can have a default or throw manually)

### Phase 3: Migrate UI Components (Bottom-Up)

Convert `.tsx` files to `.vue` SFCs (Single File Components) using `<script setup lang="ts">`.

**3.1 — Migrate shadcn primitive components**
These get replaced entirely by shadcn-vue installed components:
- `Button.tsx` → shadcn-vue `Button.vue`
- `Input.tsx` → shadcn-vue `Input.vue`
- `Checkbox.tsx` → shadcn-vue `Checkbox.vue`
- `Popover.tsx` → shadcn-vue `Popover.vue`
- `Tooltip.tsx` → shadcn-vue `Tooltip.vue`
- `dialogs/Dialog.tsx` → shadcn-vue `Dialog.vue`
- `dialogs/AlertDialog.tsx` → shadcn-vue `AlertDialog.vue`
- `ui.ts` barrel → Update imports or remove

**3.2 — Migrate leaf components**
Convert in dependency order (leaves first):

| React Component | Key Patterns to Convert |
|---|---|
| `Timer.tsx` | `useState`→`ref()`, `useRef`→`ref()`, `useCallback`→plain functions, `useEffect`→`onMounted`/`onUnmounted`, `setInterval` cleanup→`onUnmounted` |
| `SessionName.tsx` | `useState`→`ref()`, event handlers, conditional rendering `{cond && <X/>}`→`v-if` |
| `MarkdownExportDialog.tsx` | Dialog state, clipboard API |
| `SessionSwitcherDialog.tsx` | List rendering `{arr.map()}`→`v-for`, dialog state |
| `SessionSettingsMenu.tsx` | Popover + menu items, event handlers |
| `SettingsPopover.tsx` | Theme/settings composables, popover |
| `TimerEntriesTable.tsx` | `@tanstack/react-table`→`@tanstack/vue-table`, complex column defs, row selection, dialogs |

**Key React → Vue pattern mappings:**

| React | Vue 3 Composition API |
|---|---|
| `useState(init)` | `ref(init)` or `reactive({...})` |
| `useRef(init)` | `ref(init)` (for DOM: `useTemplateRef()`) |
| `useCallback(fn, deps)` | Plain function (no equivalent needed, Vue tracks reactivity automatically) |
| `useMemo(fn, deps)` | `computed(fn)` |
| `useEffect(fn, deps)` | `watch()` / `watchEffect()` |
| `useEffect(fn, [])` (mount) | `onMounted(fn)` |
| cleanup in useEffect return | `onUnmounted(fn)` |
| `{condition && <Component />}` | `<Component v-if="condition" />` |
| `{arr.map(item => <X key={item.id} />)}` | `<X v-for="item in arr" :key="item.id" />` |
| `<Component onClick={handler} />` | `<Component @click="handler" />` |
| `<input onChange={e => set(e.target.value)} />` | `<input v-model="value" />` |
| `children` prop | `<slot />` |
| `className` | `class` |
| `htmlFor` | `for` |
| `data-testid` | `data-testid` (same) |
| `React.FunctionComponent` | `defineComponent()` or `<script setup>` |
| Props interface + destructuring | `defineProps<Interface>()` |
| Callback props | `defineEmits<{...}>()` |

### Phase 4: Migrate Routes

**4.1 — Set up Vue Router**

Replace TanStack Router (React) with Vue Router. Two options:

- **Option A: `unplugin-vue-router`** — File-based routing similar to TanStack Router. Route files live in `src/pages/` and routes are auto-generated.
- **Option B: Manual `vue-router`** — Define routes explicitly in a `router.ts` file. Only 2 routes, so this is trivial.

Recommendation: **Option B** (manual) given only 2 routes. Less tooling overhead.

**4.2 — Convert route components**
- `routes/__root.tsx` → `App.vue` (layout with `<RouterLink>` and `<RouterView>`)
- `routes/index.tsx` → `views/HomeView.vue` (or `pages/IndexPage.vue`)
- `routes/capture.tsx` → `views/CaptureView.vue` (or `pages/CapturePage.vue`)

**4.3 — Create `router.ts`**
```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CaptureView from './views/CaptureView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/capture', component: CaptureView },
  ],
})
```

### Phase 5: Migrate Entry Point

**5.1 — Convert `main.tsx` → `main.ts`**
```ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
// install plugins for theme, session, timestamp settings
import './index.css'

const app = createApp(App)
app.use(router)
// app.use(sessionPlugin), app.use(themePlugin), etc.
// OR provide composables at app level
app.mount('#root')
```

**5.2 — Update `index.html`**
- Should remain the same (still `<div id="root"></div>`)

### Phase 6: Migrate Tests

**6.1 — Unit tests**
- Replace `@testing-library/react` patterns with `@testing-library/vue` or `@vue/test-utils`
- `render(<Component />)` → `mount(Component)` or `render(Component)`
- Update `setupTests.js` to remove React-specific setup

**6.2 — Storybook stories**
- Replace `@storybook/react-vite` with `@storybook/vue3-vite`
- Rewrite `.stories.tsx` files as `.stories.ts` using Vue component format
- Update Storybook config (`.storybook/main.ts`, `preview.ts`, `vitest.setup.ts`)
- Storybook `play()` functions for interaction testing remain similar (uses `@storybook/test` which is framework-agnostic for user-event simulation)

**6.3 — E2E tests (Playwright)**
- **Minimal changes needed.** Playwright tests interact with the DOM via selectors and `data-testid` attributes. As long as the same `data-testid` attributes are preserved on Vue components, E2E tests should pass with little to no modification.
- The `webServer` config in `playwright.config.ts` stays the same (`pnpm dev` on port 5173).

### Phase 7: Cleanup

**7.1 — Remove React dependencies**
```bash
pnpm --filter=@cc-experiments/client remove \
  react react-dom @types/react @types/react-dom \
  @vitejs/plugin-react \
  @tanstack/react-router @tanstack/router-cli @tanstack/router-plugin \
  @tanstack/react-table \
  radix-ui lucide-react \
  @storybook/react-vite \
  @testing-library/react \
  jsdom
```

**7.2 — Delete React-specific files**
- `src/routeTree.gen.ts` — No longer auto-generated
- `src/lib/createSafeContext.ts` — React-specific utility
- All `.tsx` files that have been fully replaced by `.vue` SFCs

**7.3 — Update configuration files**
- `eslint.config.js` — Remove React-specific rules, add Vue ESLint plugin (`eslint-plugin-vue`)
- `tsconfig.app.json` — Remove `"jsx": "react-jsx"`
- `knip.json` — Update ignore patterns for Vue files
- `.storybook/main.ts` — Framework changed to `@storybook/vue3-vite`

**7.4 — Update CLAUDE.md**
- Update tech stack documentation
- Update command references
- Update architecture description

**7.5 — Update CI/CD**
- `.github/workflows/ci.yml` — Should work as-is if commands are unchanged
- `.github/workflows/deploy-pages.yml` — Same build output, should work
- Verify Docker build still works

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| shadcn-vue components don't match React shadcn behavior exactly | Medium | Test each component; shadcn-vue is well-maintained and closely mirrors the React version |
| `@tanstack/vue-table` API differences from react-table | Medium | API is nearly identical; main difference is using `ref()` instead of `useState()` for table state |
| Loss of Storybook interaction tests during migration | Medium | Migrate stories incrementally; keep React stories working until Vue equivalents are verified |
| Radix Vue missing features vs Radix React | Low | radix-vue covers all components used (Dialog, AlertDialog, Popover, Tooltip, Checkbox) |
| E2E tests breaking | Low | Tests are DOM-based with `data-testid`; preserve these attributes |
| Build/deploy pipeline breaking | Low | Vite + Vue produces the same static output; test CI early in migration |

---

## Estimated Scope

| Category | Count |
|---|---|
| Vue SFC files to create | ~16 components + 2 views + 1 App.vue |
| Composables to create | ~5 (useLocalStorage, useIsMobile, useTheme, useSession, useTimestampSettings) |
| Config files to update | ~8 (vite.config, tsconfig, eslint, storybook, knip, package.json, CLAUDE.md, Dockerfile) |
| Test files to migrate | ~3 unit tests, ~8 story files, 0-5 E2E edits |
| Files to delete | ~40+ React .tsx files after migration |

---

## Execution Order Summary

1. **Phase 0**: Infrastructure (install Vue, update configs)
2. **Phase 1**: Verify framework-agnostic code still works
3. **Phase 2**: Composables (state management)
4. **Phase 3**: UI components (bottom-up, leaves first)
5. **Phase 4**: Routes and router
6. **Phase 5**: Entry point swap (app boots in Vue)
7. **Phase 6**: Tests and stories
8. **Phase 7**: Cleanup (remove React, update docs)

After each phase, run `pnpm build` and `pnpm test` to verify nothing is broken. After Phase 5, run `pnpm e2e` to verify the full app works end-to-end.

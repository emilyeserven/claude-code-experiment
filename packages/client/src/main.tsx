import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen.ts";

import { SessionProvider } from "@/context/SessionProvider.tsx";
import { ThemeProvider } from "@/context/ThemeProvider.tsx";
import { TimestampSettingsProvider } from "@/context/TimestampSettingsProvider.tsx";

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
});

declare module "@tanstack/react-router" {

  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          defaultTheme="light"
          storageKey="vite-ui-theme"
        >
          <TimestampSettingsProvider>
            <SessionProvider>
              <RouterProvider router={router} />
            </SessionProvider>
          </TimestampSettingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

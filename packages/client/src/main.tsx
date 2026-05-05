import { StrictMode } from "react";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { SessionProvider } from "@/context/SessionProvider.tsx";
import { ThemeProvider } from "@/context/ThemeProvider.tsx";
import { TimestampSettingsProvider } from "@/context/TimestampSettingsProvider.tsx";

import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
});

declare module "@tanstack/react-router" {

  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
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
    </StrictMode>,
  );
}

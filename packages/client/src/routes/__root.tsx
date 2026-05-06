import React from "react";

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

import { SettingsPopover } from "@/components/SettingsPopover";

const RootComponent: React.FunctionComponent = () => {
  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex gap-2">
          <Link
            to="/"
            className="[&.active]:font-bold"
            data-testid="nav-home-link"
          >
            Home
          </Link>

          <Link
            to="/capture"
            className="[&.active]:font-bold"
            data-testid="nav-capture-link"
          >
            Capture
          </Link>

          <Link
            to="/quizzes"
            className="[&.active]:font-bold"
            data-testid="nav-quizzes-link"
            activeOptions={{
              exact: false,
            }}
          >
            Quizzes
          </Link>

          <Link
            to="/grammar"
            className="[&.active]:font-bold"
            data-testid="nav-grammar-link"
          >
            Grammar
          </Link>
        </div>

        <SettingsPopover />
      </div>
      <hr />
      <Outlet />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

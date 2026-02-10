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
          >
            Home
          </Link>

          <Link
            to="/capture"
            className="[&.active]:font-bold"
          >
            Capture
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

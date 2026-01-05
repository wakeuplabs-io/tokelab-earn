import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import React from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: () => (
    <div className="w-screen h-screen flex flex-col">
      <nav className="navbar bg-base-200">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Web3 Custody
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link to="/" className="btn btn-ghost [&.active]:btn-active">
            Home
          </Link>
          <Link to="/vault" className="btn btn-ghost [&.active]:btn-active">
            Vault
          </Link>
        </div>
      </nav>
      <main className="flex flex-1 overflow-auto">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});

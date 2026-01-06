import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";
import { Header, Sidebar, Main } from "@/components/layout";
import { useSidebar } from "@/hooks/layout/useSidebar";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: () => {
    const { isOpen, toggle, close } = useSidebar();

    return (
      <div className="min-h-screen bg-base-100" data-theme="tokelab">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <Sidebar isOpen={isOpen} onClose={close} />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <Header onMenuClick={toggle} />

            {/* Main Content */}
            <Main>
              <Outlet />
            </Main>
          </div>
        </div>
        <TanStackRouterDevtools />
      </div>
    );
  },
});

/**
 * Main Component
 * Main content container
 */

import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface MainProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Main({ children, className = "", ...props }: MainProps) {
  return (
    <main className={clsx("flex-1 overflow-auto bg-base-200", className)} {...props}>
      <div className="h-full overflow-auto">
        <div className="container mx-auto px-4 md:px-6 py-6">{children}</div>
      </div>
    </main>
  );
}

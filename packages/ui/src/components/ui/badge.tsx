/**
 * Badge Component
 */

import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
  outline?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  outline = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: outline ? "badge-outline" : "badge",
    primary: outline ? "badge-primary badge-outline" : "badge-primary",
    secondary: outline ? "badge-secondary badge-outline" : "badge-secondary",
    accent: outline ? "badge-accent badge-outline" : "badge-accent",
    success: outline ? "badge-success badge-outline" : "badge-success",
    warning: outline ? "badge-warning badge-outline" : "badge-warning",
    error: outline ? "badge-error badge-outline" : "badge-error",
    info: outline ? "badge-info badge-outline" : "badge-info",
  };

  const sizeClasses = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "",
    lg: "badge-lg",
  };

  return (
    <div className={clsx(variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
}

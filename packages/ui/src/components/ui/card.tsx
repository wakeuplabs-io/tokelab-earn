/**
 * Card Component
 */

import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "bordered" | "compact";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Card({ children, className = "", variant = "default", shadow = "xl", ...props }: CardProps) {
  const variantClasses = {
    default: "bg-base-100",
    bordered: "bg-base-100 border border-base-300",
    compact: "bg-base-100",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div className={clsx("card p-6", variantClasses[variant], shadowClasses[shadow], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-header", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={clsx("card-title", className)}>{children}</h2>;
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-body", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-footer", className)}>{children}</div>;
}

/**
 * Button Component
 */

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "ghost"
    | "success"
    | "error"
    | "warning"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "btn rounded-xl text-base font-semibold leading-[22px] align-middle tracking-normal";
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      outline: "btn-outline",
      ghost: "btn-ghost",
      success: "btn-success",
      error: "btn-error",
      warning: "btn-warning",
      info: "btn-info",
    };
    const sizeClasses = {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

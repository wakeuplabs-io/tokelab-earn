import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, iconLeft, iconRight, className = "", ...props }, ref) => {
    const inputClasses = clsx(
      "input w-full rounded-lg",
      "border border-neutral-silver",
      "bg-base-100",
      "text-base-content",
      "placeholder:text-neutral-l-grey",
      "focus:outline-none focus:border-primary-blue",
      "disabled:bg-neutral-disabled disabled:border-neutral-silver disabled:text-neutral-l-grey disabled:placeholder:text-neutral-l-grey",
      {
        "input-error": error,
        "input-success": success && !error,
        "pl-10": iconLeft,
        "pr-10": iconRight,
      },
      className,
    );

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div
              className={clsx("absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none", {
                "text-error": error,
                "text-success": success && !error,
                "text-neutral-l-grey": props.disabled || (!error && !success),
              })}
            >
              {iconLeft}
            </div>
          )}
          <input ref={ref} className={inputClasses} disabled={props.disabled} {...props} />
          {iconRight && (
            <div
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none",
                {
                  "text-error": error,
                  "text-success": success && !error,
                  "text-neutral-l-grey": props.disabled || (!error && !success),
                },
              )}
            >
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

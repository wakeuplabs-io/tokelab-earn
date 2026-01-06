/**
 * Avatar Component
 */

import { HTMLAttributes } from "react";
import clsx from "clsx";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "offline" | "away";
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  className = "",
  ...props
}: AvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const statusClasses = {
    online: "bg-success",
    offline: "bg-base-300",
    away: "bg-warning",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={clsx("avatar", className)} {...props}>
      <div className={clsx(sizeClasses[size], "rounded-full")}>
        {src ? (
          <img src={src} alt={alt || name} />
        ) : name ? (
          <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content font-semibold">
            {getInitials(name)}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-base-300">
            <svg
              className="w-1/2 h-1/2 text-base-content opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {status && (
          <div
            className={clsx("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100", statusClasses[status])}
          />
        )}
      </div>
    </div>
  );
}


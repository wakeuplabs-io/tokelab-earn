/**
 * StatusBadge Component
 * A reusable badge component for displaying status with a colored dot
 */

import clsx from "clsx";

const dotColorMap = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-400",
} as const;

export type DotColor = keyof typeof dotColorMap;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The color of the status dot */
  dotColor: DotColor;
  /** The label text to display */
  label: string;
}

export function StatusBadge({
  className,
  dotColor,
  label,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border-2 border-base-300 bg-white text-base-content",
        className
      )}
      {...props}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full mr-1.5", dotColorMap[dotColor])} />
      {label}
    </span>
  );
}

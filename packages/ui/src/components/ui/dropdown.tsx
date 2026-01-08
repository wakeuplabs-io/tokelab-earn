import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right" | "center";
  position?: "top" | "bottom";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align,
  position = "bottom",
  className = "",
  ...props
}: DropdownProps) {
  const alignClasses = {
    left: "dropdown-left",
    right: "dropdown-right",
    center: "dropdown-center",
  };

  const positionClasses = {
    top: "dropdown-top",
    bottom: "",
  };

  return (
    <div
      className={clsx(
        "dropdown",
        align && alignClasses[align],
        positionClasses[position],
        className,
      )}
      {...props}
    >
      <div tabIndex={0} role="button">
        {trigger}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300"
      >
        {children}
      </ul>
    </div>
  );
}

export interface DropdownItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}: DropdownItemProps) {
  return (
    <li
      className={clsx(disabled && "disabled", className)}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      <a className={clsx(disabled && "opacity-50 cursor-not-allowed")}>{children}</a>
    </li>
  );
}

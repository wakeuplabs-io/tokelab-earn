/**
 * SelectFilter Component
 * Generic reusable select filter for tables and lists
 */

import clsx from "clsx";

export interface SelectFilterOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFilterProps<T extends string = string> {
  /** Current selected value */
  value: T | "";
  /** Callback when value changes */
  onChange: (value: T | "") => void;
  /** Available options */
  options: SelectFilterOption<T>[];
  /** Placeholder text when no value selected */
  placeholder: string;
  /** Optional class name */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
}

export function SelectFilter<T extends string = string>({
  value,
  onChange,
  options,
  placeholder,
  className,
  size = "sm",
}: SelectFilterProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T | "");
  };

  return (
    <select
      className={clsx("select select-bordered", size === "sm" && "select-sm", className)}
      value={value}
      onChange={handleChange}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

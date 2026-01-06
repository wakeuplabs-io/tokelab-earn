/**
 * SearchInput Component
 * Higher Order Component that wraps Input with debounce functionality
 */

import { useState, useCallback, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { Input, InputProps } from "./input";
import { useDebounce } from "../../hooks/utils/useDebounce";

export interface SearchInputProps extends Omit<InputProps, "onChange" | "value" | "defaultValue"> {
  onSearch?: (value: string) => void;
  debounceDelay?: number;
  defaultValue?: string;
}

export function SearchInput({
  onSearch,
  debounceDelay = 300,
  defaultValue = "",
  placeholder = "Buscar...",
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState<string>(defaultValue);
  const debouncedValue = useDebounce(value, debounceDelay);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  // Call onSearch when debounced value changes
  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  // Effect to trigger search when debounced value changes
  useEffect(() => {
    handleSearch();
  }, [debouncedValue, handleSearch]);

  const searchIcon = <HiSearch className="w-5 h-5 text-current" />;

  return (
    <Input
      {...props}
      iconLeft={searchIcon}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}


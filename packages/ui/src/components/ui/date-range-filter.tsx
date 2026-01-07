/**
 * DateRangeFilter Component
 * A dropdown filter for selecting date ranges with presets
 * Uses react-date-range for calendar functionality
 */

import { useState, useRef, useEffect } from "react";
import { DateRangePicker, createStaticRanges } from "react-date-range";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
} from "date-fns";
import { es } from "date-fns/locale";
import clsx from "clsx";
import { HiOutlineCalendar, HiX } from "react-icons/hi";
import { formatDisplayDate } from "../../lib/format";

// Import react-date-range styles
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface DateRangeFilterProps {
  /** Current date range value */
  value: DateRange;
  /** Callback when date range changes */
  onChange: (range: DateRange) => void;
  /** Button label when no dates selected */
  placeholder?: string;
  /** Optional class name */
  className?: string;
}

/**
 * Custom static ranges for the sidebar
 */
const staticRanges = createStaticRanges([
  {
    label: "Hoy",
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: "Ayer",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Semana en curso",
    range: () => ({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Semana anterior",
    range: () => ({
      startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Mes en curso",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: "Mes anterior",
    range: () => ({
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: "Año en curso",
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
  {
    label: "Año anterior",
    range: () => ({
      startDate: startOfYear(subYears(new Date(), 1)),
      endDate: endOfYear(subYears(new Date(), 1)),
    }),
  },
]);

export function DateRangeFilter({
  value,
  onChange,
  placeholder = "Filtrar por fecha",
  className,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localRange, setLocalRange] = useState({
    startDate: value.from ? new Date(value.from) : new Date(),
    endDate: value.to ? new Date(value.to) : new Date(),
    key: "selection",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync local state with prop value
  useEffect(() => {
    setLocalRange({
      startDate: value.from ? new Date(value.from) : new Date(),
      endDate: value.to ? new Date(value.to) : new Date(),
      key: "selection",
    });
  }, [value.from, value.to]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (ranges: any) => {
    setLocalRange(ranges.selection);
  };

  const handleApply = () => {
    onChange({
      from: format(localRange.startDate, "yyyy-MM-dd"),
      to: format(localRange.endDate, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset to original value
    setLocalRange({
      startDate: value.from ? new Date(value.from) : new Date(),
      endDate: value.to ? new Date(value.to) : new Date(),
      key: "selection",
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ from: null, to: null });
    setLocalRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
    setIsOpen(false);
  };

  const hasValue = value.from || value.to;

  // Generate display text for button
  const getButtonText = () => {
    if (!hasValue) return placeholder;
    if (value.from && value.to) {
      return `${formatDisplayDate(value.from)} - ${formatDisplayDate(value.to)}`;
    }
    if (value.from) return `Desde ${formatDisplayDate(value.from)}`;
    if (value.to) return `Hasta ${formatDisplayDate(value.to)}`;
    return placeholder;
  };

  return (
    <div ref={dropdownRef} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border bg-white hover:bg-base-200 transition-colors whitespace-nowrap",
          hasValue ? "border-primary text-primary" : "border-base-300 text-base-content"
        )}
      >
        <HiOutlineCalendar className="w-4 h-4 flex-shrink-0" />
        <span>{getButtonText()}</span>
        {hasValue && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="hover:bg-base-300 rounded-full p-0.5 flex-shrink-0 cursor-pointer"
          >
            <HiX className="w-3 h-3" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-base-100 rounded-xl shadow-xl border border-base-300 overflow-hidden date-range-filter">
          <div className="flex">
            <DateRangePicker
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={[localRange]}
              direction="horizontal"
              staticRanges={staticRanges}
              inputRanges={[]}
              locale={es}
              rangeColors={["#535EFF"]}
              color="#535EFF"
            />
          </div>

          {/* Footer with date inputs and buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-base-300 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={format(localRange.startDate, "d MMM, yyyy", { locale: es })}
                className="input input-bordered input-sm w-32 text-center bg-white"
              />
              <span className="text-base-content/50">–</span>
              <input
                type="text"
                readOnly
                value={format(localRange.endDate, "d MMM, yyyy", { locale: es })}
                className="input input-bordered input-sm w-32 text-center bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-base-content hover:bg-base-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

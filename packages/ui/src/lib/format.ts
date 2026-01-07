/**
 * Format utility functions
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format number with thousand separators (Argentina locale)
 */
export function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Format date for display (D MMM, YYYY) with Spanish locale
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, "d MMM, yyyy", { locale: es });
}

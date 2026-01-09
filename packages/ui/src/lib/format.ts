/**
 * Format utility functions
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DotColor } from "../components/ui/status-badge";
import type { InvestmentModelType, InvestmentStatus } from "../domain/entities/investment";

export interface StatusBadgeConfig {
  label: string;
  dotColor: DotColor;
}

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

/**
 * Get status badge config for investment status
 */
export function getInvestmentStatusConfig(status: InvestmentStatus): StatusBadgeConfig {
  const statusMap: Record<InvestmentStatus, StatusBadgeConfig> = {
    ACTIVE: { label: "Activo", dotColor: "success" },
    COMPLETED: { label: "Finalizado", dotColor: "neutral" },
    CANCELLED: { label: "Cancelado", dotColor: "error" },
  };
  return statusMap[status];
}

/**
 * Get label for investment model type
 */
export function getModelTypeLabel(modelType: InvestmentModelType): string {
  return modelType === "FIXED" ? "Fijo" : "Variable";
}

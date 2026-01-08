/**
 * Date utility functions
 */

/**
 * Get previous month in YYYY-MM format
 */
export function getPreviousMonth(): string {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = String(prevMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

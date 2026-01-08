/**
 * Pagination Helpers
 *
 * Shared utilities for paginated queries
 */

import type { PaginationMeta } from "../domain/entities/investment";

/**
 * Calculate skip and take values for pagination
 */
export function calculatePaginationOffsets(
  page: number,
  limit: number,
): { skip: number; take: number } {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

/**
 * Build pagination metadata from query results
 */
export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

/**
 * Extract variable APR from MonthlyYield record
 */
export function extractVariableAPR(
  monthlyYield: { actualReturnPct: string } | null,
): number | null {
  return monthlyYield ? parseFloat(monthlyYield.actualReturnPct) : null;
}

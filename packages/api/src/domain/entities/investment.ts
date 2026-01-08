/**
 * Investment domain entity
 * Represents an investment made by a user in either FIXED or VARIABLE model
 */

export type InvestmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type InvestmentModelType = "FIXED" | "VARIABLE";

// Constants for type-safe comparisons
export const MODEL_TYPE = {
  FIXED: "FIXED",
  VARIABLE: "VARIABLE",
} as const satisfies Record<string, InvestmentModelType>;

export interface Investment {
  id: string;
  userId: string;
  modelConfigId: string;
  amount: string; // Decimal as string
  currency: string;
  status: InvestmentStatus;
  startDate: Date;
  endDate: Date;
  accruedYield: string; // Decimal as string
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Investment with related data for listing
 */
export interface InvestmentWithRelations extends Investment {
  user: {
    email: string;
  };
  modelConfig: {
    type: InvestmentModelType;
    durationDays: number; // Investment duration in days
    aprInitial: string | null;
    aprFinal: string | null;
    aprStepPct: string | null;
    aprStepPeriodDays: number | null;
    claimPeriodDays: number | null; // FIXED only: days between claim windows
  };
  yields: Array<{
    amount: string;
    status: string;
    monthlyYieldId: string | null; // For VARIABLE: linked to MonthlyYield
  }>;
}

/**
 * Base DTO with common investment fields
 */
export interface BaseInvestmentDTO {
  id: string;
  status: InvestmentStatus;
  modelType: InvestmentModelType;
  startDate: string; // ISO string
  endDate: string; // ISO string
  currentAPR: number | null;
  initialAmount: string;
  accruedYield: string;
  daysToCollect: number;
  availableToClaim: string;
  totalClaimed: string;
}

/**
 * DTO for admin investment list response (includes userEmail)
 */
export interface InvestmentDTO extends BaseInvestmentDTO {
  userEmail: string;
}

/**
 * Filters for listing investments
 */
export interface ListInvestmentsFilters {
  status?: InvestmentStatus;
  modelType?: InvestmentModelType;
  search?: string; // Search by user email
  dateFrom?: Date; // Filter by startDate >= dateFrom
  dateTo?: Date; // Filter by startDate <= dateTo
}

/**
 * Parameters for listing investments
 */
export interface ListInvestmentsParams {
  page: number;
  limit: number;
  filters?: ListInvestmentsFilters;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Generic paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Result of listing investments (admin)
 */
export type ListInvestmentsResult = PaginatedResult<InvestmentDTO>;

// ============================================
// User Investment Types (for authenticated user)
// ============================================

export type ClaimStatus = "Disponible" | "Pendiente" | "Completado";

/**
 * DTO for user's own investment list response (includes claimStatus)
 */
export interface UserInvestmentDTO extends BaseInvestmentDTO {
  claimStatus: ClaimStatus;
}

/**
 * Filters for user's investments (subset of admin filters, no search)
 */
export interface UserInvestmentsFilters {
  status?: InvestmentStatus;
  modelType?: InvestmentModelType;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Parameters for listing user's investments
 */
export interface GetUserInvestmentsParams {
  userId: string;
  page: number;
  limit: number;
  filters?: UserInvestmentsFilters;
}

/**
 * Result of listing user's investments
 */
export type GetUserInvestmentsResult = PaginatedResult<UserInvestmentDTO>;

/**
 * User investment summary (total available to claim)
 */
export interface UserInvestmentSummary {
  totalAvailableToClaim: string;
  currency: string;
}

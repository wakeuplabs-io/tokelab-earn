/**
 * Investment domain entity
 * Represents an investment made by a user in either FIXED or VARIABLE model
 */

export type InvestmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type InvestmentModelType = "FIXED" | "VARIABLE";

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
 * DTO for investment list response
 */
export interface InvestmentDTO {
  id: string;
  userEmail: string;
  status: InvestmentStatus;
  modelType: InvestmentModelType;
  startDate: string; // ISO string
  endDate: string; // ISO string
  currentAPR: number | null; // Calculated for FIXED, null for VARIABLE
  initialAmount: string;
  accruedYield: string;
  daysToCollect: number; // Days until next claim window
  availableToClaim: string; // PENDING yields that can be claimed now
  totalClaimed: string; // PAID yields (already claimed)
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
 * Result of listing investments
 */
export interface ListInvestmentsResult {
  data: InvestmentDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

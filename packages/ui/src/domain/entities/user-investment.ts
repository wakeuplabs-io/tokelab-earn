/**
 * User Investment domain entity
 * For authenticated user's own investments (different from admin Investment)
 */

import type { InvestmentModelType, InvestmentStatus } from "./investment";

export type ClaimStatus = "Disponible" | "Pendiente" | "Completado";

export interface UserInvestment {
  id: string;
  status: InvestmentStatus;
  modelType: InvestmentModelType;
  startDate: string;
  endDate: string;
  currentAPR: number | null;
  initialAmount: string;
  accruedYield: string;
  daysToCollect: number;
  totalClaimed: string;
  availableToClaim: string;
  claimStatus: ClaimStatus;
}

export interface UserInvestmentSummary {
  totalAvailableToClaim: string;
  currency: string;
}

export interface GetUserInvestmentsParams {
  page?: number;
  limit?: number;
  status?: InvestmentStatus;
  modelType?: InvestmentModelType;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetUserInvestmentsResponse {
  data: UserInvestment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

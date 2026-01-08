/**
 * Investment domain entity
 */

export type InvestmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type InvestmentModelType = "FIXED" | "VARIABLE";

export interface Investment {
  id: string;
  userEmail: string;
  status: InvestmentStatus;
  modelType: InvestmentModelType;
  startDate: string;
  endDate: string;
  currentAPR: number | null;
  initialAmount: string;
  accruedYield: string;
  daysToCollect: number;
  availableToClaim: string;
  totalClaimed: string;
}

export interface ListInvestmentsParams {
  page?: number;
  limit?: number;
  status?: InvestmentStatus;
  modelType?: InvestmentModelType;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ListInvestmentsResponse {
  data: Investment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

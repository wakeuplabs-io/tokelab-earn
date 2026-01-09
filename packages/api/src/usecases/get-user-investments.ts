/**
 * GetUserInvestments Use Case
 *
 * Lists investments for the authenticated user with pagination and filters
 * Includes calculated fields like current APR, days to collect, and claim status
 */

import { InvestmentRepository } from "../infra/db/repositories/investment-repository";
import { MonthlyYieldRepository } from "../infra/db/repositories/monthly-yield-repository";
import { getPreviousMonth } from "../lib/date-utils";
import {
  buildPaginationMeta,
  calculatePaginationOffsets,
  extractVariableAPR,
} from "../lib/pagination";
import {
  type GetUserInvestmentsParams,
  type GetUserInvestmentsResult,
  type UserInvestmentDTO,
  type InvestmentWithRelations,
} from "../domain/entities/investment";
import {
  calculateAccruedYield,
  calculateAvailableToClaim,
  calculateClaimStatus,
  calculateCurrentAPR,
  calculateDaysToCollect,
  calculateTotalClaimed,
} from "../domain/calculations/investment-calculations";

/**
 * Transform investment with relations to User DTO
 */
function toUserDTO(
  investment: InvestmentWithRelations,
  variableAPR: number | null,
): UserInvestmentDTO {
  return {
    id: investment.id,
    status: investment.status,
    modelType: investment.modelConfig.type,
    startDate: investment.startDate.toISOString(),
    endDate: investment.endDate.toISOString(),
    currentAPR: calculateCurrentAPR(investment, variableAPR),
    initialAmount: investment.amount,
    accruedYield: calculateAccruedYield(investment.yields),
    daysToCollect: calculateDaysToCollect(investment),
    totalClaimed: calculateTotalClaimed(investment.yields),
    availableToClaim: calculateAvailableToClaim(investment),
    claimStatus: calculateClaimStatus(investment),
  };
}

/**
 * Get user's investments with pagination and filters
 */
export async function getUserInvestments(
  params: GetUserInvestmentsParams,
  deps: {
    investmentRepository: InvestmentRepository;
    monthlyYieldRepository: MonthlyYieldRepository;
  },
): Promise<GetUserInvestmentsResult> {
  const { userId, page, limit, filters } = params;
  const { skip, take } = calculatePaginationOffsets(page, limit);
  const previousMonth = getPreviousMonth();

  const [investments, total, monthlyYield] = await Promise.all([
    deps.investmentRepository.findByUserIdPaginated(userId, skip, take, filters),
    deps.investmentRepository.countByUserId(userId, filters),
    deps.monthlyYieldRepository.findByMonth(previousMonth),
  ]);

  const variableAPR = extractVariableAPR(monthlyYield);
  const data = investments.map((inv) => toUserDTO(inv, variableAPR));

  return {
    data,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

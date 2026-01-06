/**
 * ListInvestments Use Case
 *
 * Lists all investments with pagination and filters (Admin endpoint)
 * Includes calculated fields like current APR and days to collect
 */

import { InvestmentRepository } from "../infra/db/repositories/investment-repository";
import { MonthlyYieldRepository } from "../infra/db/repositories/monthly-yield-repository";
import type {
  ListInvestmentsParams,
  ListInvestmentsResult,
  InvestmentDTO,
  InvestmentWithRelations,
} from "../domain/entities/investment";

/**
 * Get previous month in YYYY-MM format
 */
function getPreviousMonth(): string {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = String(prevMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Calculate APR for FIXED model investments for the LAST COMPLETED month
 * APR increases progressively from initial to final based on completed months
 *
 * Example: APR 15% to 20%, step 1%, started January
 * - January: 15%
 * - February: 16%
 * - If we're on March 16th, we show 16% (February's APR)
 *
 * @param startDate - Investment start date
 * @param aprInitial - Initial APR percentage
 * @param aprFinal - Maximum APR percentage
 * @param aprStepPct - APR increase per step
 * @param aprStepPeriodDays - Days between each step
 * @returns APR percentage for the last completed month
 */
function calculateLastCompletedMonthAPR(
  startDate: Date,
  aprInitial: number,
  aprFinal: number,
  aprStepPct: number,
  aprStepPeriodDays: number,
): number {
  const now = new Date();

  // Get the first day of current month (this is the end of last completed month)
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calculate days from start to end of last completed month
  const daysSinceStart = Math.floor(
    (firstDayOfCurrentMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // If investment started this month or later, no completed months yet
  if (daysSinceStart <= 0) {
    return aprInitial;
  }

  // Calculate completed steps (full periods)
  const completedSteps = Math.floor(daysSinceStart / aprStepPeriodDays);
  const apr = aprInitial + completedSteps * aprStepPct;

  return Math.min(apr, aprFinal);
}

/**
 * Calculate days until next claim window for FIXED model
 * Claims are available every claimPeriodDays from startDate
 *
 * @param startDate - Investment start date
 * @param claimPeriodDays - Days between claim windows (e.g., 60)
 * @returns Days until next claim window
 */
function calculateDaysToNextClaimFixed(startDate: Date, claimPeriodDays: number): number {
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceStart < 0) {
    // Investment hasn't started yet
    return claimPeriodDays;
  }

  // Days into current period
  const daysInCurrentPeriod = daysSinceStart % claimPeriodDays;

  // Days until next claim window
  return claimPeriodDays - daysInCurrentPeriod;
}

/**
 * Calculate days until next claim window for VARIABLE model
 * Claims are available when MonthlyYield is processed (yields have monthlyYieldId)
 *
 * @param yields - Array of investment yields
 * @returns 0 if claimable now, otherwise days until end of current month
 */
function calculateDaysToNextClaimVariable(
  yields: Array<{ status: string; monthlyYieldId: string | null }>,
): number {
  // Check if there are PENDING yields with monthlyYieldId (claimable now)
  const hasClaimableYield = yields.some((y) => y.status === "PENDING" && y.monthlyYieldId !== null);

  if (hasClaimableYield) {
    return 0;
  }

  // Calculate days until end of current month
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days to collect based on model type
 */
function calculateDaysToCollect(investment: InvestmentWithRelations): number {
  if (investment.modelConfig.type === "FIXED") {
    const claimPeriodDays = investment.modelConfig.claimPeriodDays;
    if (claimPeriodDays) {
      return calculateDaysToNextClaimFixed(investment.startDate, claimPeriodDays);
    }
    // Fallback: days until investment end
    const now = new Date();
    const diffMs = investment.endDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  // VARIABLE model
  return calculateDaysToNextClaimVariable(investment.yields);
}

/**
 * Calculate total accrued yield from investment yields
 *
 * @param yields - Array of yield records
 * @returns Total yield amount as string
 */
function calculateAccruedYield(yields: Array<{ amount: string; status: string }>): string {
  const total = yields.reduce((sum, y) => sum + parseFloat(y.amount), 0);
  return total.toFixed(6);
}

/**
 * Calculate available to claim based on model type
 * FIXED: PENDING yields from completed claim periods
 * VARIABLE: PENDING yields with monthlyYieldId (MonthlyYield processed)
 */
function calculateAvailableToClaim(investment: InvestmentWithRelations): string {
  const pendingYields = investment.yields.filter((y) => y.status === "PENDING");

  if (investment.modelConfig.type === "FIXED") {
    const claimPeriodDays = investment.modelConfig.claimPeriodDays;
    if (!claimPeriodDays) {
      // No claim period configured, all pending are available
      return pendingYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
    }

    // Calculate how many complete claim periods have passed
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - investment.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const completedPeriods = Math.floor(daysSinceStart / claimPeriodDays);

    if (completedPeriods <= 0) {
      return "0.000000";
    }

    // All pending yields are claimable if at least one period is complete
    // (In a more complex implementation, you might track which yields belong to which period)
    return pendingYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
  }

  // VARIABLE: Only yields with monthlyYieldId are claimable
  const claimableYields = pendingYields.filter((y) => y.monthlyYieldId !== null);
  return claimableYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
}

/**
 * Calculate total claimed (PAID yields)
 */
function calculateTotalClaimed(yields: Array<{ amount: string; status: string }>): string {
  const paidYields = yields.filter((y) => y.status === "PAID");
  return paidYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
}

/**
 * Transform investment with relations to DTO
 * @param investment - Investment with relations
 * @param variableAPR - APR from MonthlyYield for VARIABLE model (null if not available)
 */
function toDTO(investment: InvestmentWithRelations, variableAPR: number | null): InvestmentDTO {
  let currentAPR: number | null = null;

  if (investment.modelConfig.type === "FIXED") {
    // FIXED: Calculate APR for the last completed month
    if (
      investment.modelConfig.aprInitial !== null &&
      investment.modelConfig.aprFinal !== null &&
      investment.modelConfig.aprStepPct !== null &&
      investment.modelConfig.aprStepPeriodDays !== null
    ) {
      currentAPR = calculateLastCompletedMonthAPR(
        investment.startDate,
        parseFloat(investment.modelConfig.aprInitial),
        parseFloat(investment.modelConfig.aprFinal),
        parseFloat(investment.modelConfig.aprStepPct),
        investment.modelConfig.aprStepPeriodDays,
      );
    }
  } else {
    // VARIABLE: Use the APR from MonthlyYield of previous month
    currentAPR = variableAPR;
  }

  return {
    id: investment.id,
    userEmail: investment.user.email,
    status: investment.status,
    modelType: investment.modelConfig.type,
    startDate: investment.startDate.toISOString(),
    endDate: investment.endDate.toISOString(),
    currentAPR,
    initialAmount: investment.amount,
    accruedYield: calculateAccruedYield(investment.yields),
    daysToCollect: calculateDaysToCollect(investment),
    availableToClaim: calculateAvailableToClaim(investment),
    totalClaimed: calculateTotalClaimed(investment.yields),
  };
}

/**
 * List investments with pagination and filters
 *
 * @param params - Pagination and filter parameters
 * @param deps - Dependencies (repositories)
 * @returns Paginated list of investments
 */
export async function listInvestments(
  params: ListInvestmentsParams,
  deps: {
    investmentRepository: InvestmentRepository;
    monthlyYieldRepository: MonthlyYieldRepository;
  },
): Promise<ListInvestmentsResult> {
  const { page, limit, filters } = params;

  // Calculate pagination
  const skip = (page - 1) * limit;
  const take = limit;

  // Get previous month for VARIABLE APR lookup
  const previousMonth = getPreviousMonth();

  // Fetch investments, count, and monthly yield in parallel
  const [investments, total, monthlyYield] = await Promise.all([
    deps.investmentRepository.findAllPaginated(skip, take, filters),
    deps.investmentRepository.count(filters),
    deps.monthlyYieldRepository.findByMonth(previousMonth),
  ]);

  // Get variable APR from previous month's MonthlyYield
  const variableAPR = monthlyYield ? parseFloat(monthlyYield.actualReturnPct) : null;

  // Transform to DTOs
  const data = investments.map((inv) => toDTO(inv, variableAPR));

  // Calculate total pages
  const pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  };
}

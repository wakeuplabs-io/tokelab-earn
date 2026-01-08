/**
 * Investment Calculations
 *
 * Shared calculation functions for investment-related operations.
 * Used by multiple use cases (list-investments, get-user-investments, get-user-investments-summary)
 */

import { MODEL_TYPE, type ClaimStatus, type InvestmentWithRelations } from "../entities/investment";

/**
 * Calculate APR for FIXED model investments for the LAST COMPLETED month
 * APR increases progressively from initial to final based on completed months
 *
 * Example: APR 15% to 20%, step 1%, started January
 * - January: 15%
 * - February: 16%
 * - If we're on March 16th, we show 16% (February's APR)
 */
export function calculateLastCompletedMonthAPR(
  startDate: Date,
  aprInitial: number,
  aprFinal: number,
  aprStepPct: number,
  aprStepPeriodDays: number,
): number {
  const now = new Date();
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysSinceStart = Math.floor(
    (firstDayOfCurrentMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceStart <= 0) {
    return aprInitial;
  }

  const completedSteps = Math.floor(daysSinceStart / aprStepPeriodDays);
  const apr = aprInitial + completedSteps * aprStepPct;

  return Math.min(apr, aprFinal);
}

/**
 * Calculate days until next claim window for FIXED model
 * Claims are available every claimPeriodDays from startDate
 */
export function calculateDaysToNextClaimFixed(startDate: Date, claimPeriodDays: number): number {
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceStart < 0) {
    return claimPeriodDays;
  }

  const daysInCurrentPeriod = daysSinceStart % claimPeriodDays;
  return claimPeriodDays - daysInCurrentPeriod;
}

/**
 * Calculate days until next claim window for VARIABLE model
 * Claims are available when MonthlyYield is processed (yields have monthlyYieldId)
 *
 * @returns 0 if claimable now, otherwise days until end of current month
 */
export function calculateDaysToNextClaimVariable(
  yields: Array<{ status: string; monthlyYieldId: string | null }>,
): number {
  const hasClaimableYield = yields.some((y) => y.status === "PENDING" && y.monthlyYieldId !== null);

  if (hasClaimableYield) {
    return 0;
  }

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days to collect based on model type
 */
export function calculateDaysToCollect(investment: InvestmentWithRelations): number {
  if (investment.modelConfig.type === MODEL_TYPE.FIXED) {
    const claimPeriodDays = investment.modelConfig.claimPeriodDays;
    if (claimPeriodDays) {
      return calculateDaysToNextClaimFixed(investment.startDate, claimPeriodDays);
    }
    const now = new Date();
    const diffMs = investment.endDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  return calculateDaysToNextClaimVariable(investment.yields);
}

/**
 * Calculate total accrued yield from investment yields
 */
export function calculateAccruedYield(yields: Array<{ amount: string; status: string }>): string {
  const total = yields.reduce((sum, y) => sum + parseFloat(y.amount), 0);
  return total.toFixed(6);
}

/**
 * Calculate available to claim based on model type
 * FIXED: PENDING yields from completed claim periods
 * VARIABLE: PENDING yields with monthlyYieldId (MonthlyYield processed)
 *
 * @returns Amount as string with 6 decimal places
 */
export function calculateAvailableToClaim(investment: InvestmentWithRelations): string {
  const pendingYields = investment.yields.filter((y) => y.status === "PENDING");

  if (investment.modelConfig.type === MODEL_TYPE.FIXED) {
    const claimPeriodDays = investment.modelConfig.claimPeriodDays;
    if (!claimPeriodDays) {
      return pendingYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
    }

    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - investment.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const completedPeriods = Math.floor(daysSinceStart / claimPeriodDays);

    if (completedPeriods <= 0) {
      return "0.000000";
    }

    return pendingYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
  }

  // VARIABLE: Only yields with monthlyYieldId are claimable
  const claimableYields = pendingYields.filter((y) => y.monthlyYieldId !== null);
  return claimableYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
}

/**
 * Calculate available to claim as number (for summation)
 */
export function calculateAvailableToClaimAsNumber(investment: InvestmentWithRelations): number {
  return parseFloat(calculateAvailableToClaim(investment));
}

/**
 * Calculate total claimed (CLAIMED yields)
 */
export function calculateTotalClaimed(yields: Array<{ amount: string; status: string }>): string {
  const claimedYields = yields.filter((y) => y.status === "CLAIMED");
  return claimedYields.reduce((sum, y) => sum + parseFloat(y.amount), 0).toFixed(6);
}

/**
 * Calculate current APR based on model type
 */
export function calculateCurrentAPR(
  investment: InvestmentWithRelations,
  variableAPR: number | null,
): number | null {
  if (investment.modelConfig.type === MODEL_TYPE.FIXED) {
    if (
      investment.modelConfig.aprInitial !== null &&
      investment.modelConfig.aprFinal !== null &&
      investment.modelConfig.aprStepPct !== null &&
      investment.modelConfig.aprStepPeriodDays !== null
    ) {
      return calculateLastCompletedMonthAPR(
        investment.startDate,
        parseFloat(investment.modelConfig.aprInitial),
        parseFloat(investment.modelConfig.aprFinal),
        parseFloat(investment.modelConfig.aprStepPct),
        investment.modelConfig.aprStepPeriodDays,
      );
    }
    return null;
  }

  return variableAPR;
}

/**
 * Determine claim status based on yields and availability
 * - "Disponible": Has yields available to claim now
 * - "Pendiente": Has PENDING yields but not in claim window yet
 * - "Completado": No PENDING yields (all claimed or no yields)
 */
export function calculateClaimStatus(investment: InvestmentWithRelations): ClaimStatus {
  const pendingYields = investment.yields.filter((y) => y.status === "PENDING");

  if (pendingYields.length === 0) {
    return "Completado";
  }

  const availableAmount = parseFloat(calculateAvailableToClaim(investment));

  if (availableAmount > 0) {
    return "Disponible";
  }

  return "Pendiente";
}

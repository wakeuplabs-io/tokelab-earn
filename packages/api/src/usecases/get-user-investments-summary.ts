/**
 * GetUserInvestmentsSummary Use Case
 *
 * Calculates total available to claim for the authenticated user
 */

import { InvestmentRepository } from "../infra/db/repositories/investment-repository";
import { type UserInvestmentSummary } from "../domain/entities/investment";
import { calculateAvailableToClaimAsNumber } from "../domain/calculations/investment-calculations";

/**
 * Get total available to claim for a user across all their investments
 */
export async function getUserInvestmentsSummary(
  params: { userId: string },
  deps: {
    investmentRepository: InvestmentRepository;
  },
): Promise<UserInvestmentSummary> {
  const { userId } = params;

  // Get all user investments with yields (no pagination, we need all)
  const investments = await deps.investmentRepository.findByUserIdPaginated(
    userId,
    0, // skip
    1000, // take a large number to get all
    { status: "ACTIVE" }, // Only ACTIVE investments can have claimable yields
  );

  // Sum available to claim across all investments
  const totalAvailable = investments.reduce((sum, inv) => {
    return sum + calculateAvailableToClaimAsNumber(inv);
  }, 0);

  return {
    totalAvailableToClaim: totalAvailable.toFixed(6),
    currency: "USDT", // Default currency
  };
}

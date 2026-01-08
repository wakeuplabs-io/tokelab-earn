/**
 * Investment Hooks
 * React Query hooks for investment operations
 */

import { useQuery } from "@tanstack/react-query";
import { investmentService } from "../../services/investment.service";
import { useAuth } from "../auth/useAuth";
import type { ListInvestmentsParams } from "../../domain/entities/investment";

const QUERY_KEYS = {
  investments: ["investments"] as const,
};

/**
 * List all investments with pagination and filters
 */
export function useInvestments(params: ListInvestmentsParams = {}) {
  const { getToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.investments, params],
    queryFn: async () => {
      // In development, auth is bypassed on backend
      const token = isAuthenticated ? await getToken() : "";
      return investmentService.list(params, token);
    },
    // Always enabled - backend handles auth bypass in development
    enabled: true,
  });
}

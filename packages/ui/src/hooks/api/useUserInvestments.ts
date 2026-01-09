/**
 * User Investment Hooks
 * React Query hooks for user's own investment operations
 */

import { useQuery } from "@tanstack/react-query";
import { userInvestmentService } from "../../services/user-investment.service";
import { useAuth } from "../auth/useAuth";
import type { GetUserInvestmentsParams } from "../../domain/entities/user-investment";

const QUERY_KEYS = {
  userInvestments: ["userInvestments"] as const,
  userInvestmentsSummary: ["userInvestmentsSummary"] as const,
};

/**
 * Get user's investments with pagination and filters
 */
export function useUserInvestments(params: GetUserInvestmentsParams = {}) {
  const { getToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.userInvestments, params],
    queryFn: async () => {
      const token = isAuthenticated ? await getToken() : "";
      return userInvestmentService.list(params, token);
    },
    enabled: true,
  });
}

/**
 * Get user's investment summary (total available to claim)
 */
export function useUserInvestmentsSummary() {
  const { getToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.userInvestmentsSummary,
    queryFn: async () => {
      const token = isAuthenticated ? await getToken() : "";
      return userInvestmentService.getSummary(token);
    },
    enabled: true,
  });
}

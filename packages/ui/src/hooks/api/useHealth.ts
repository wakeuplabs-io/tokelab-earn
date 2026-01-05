/**
 * Health Check Hook
 * React Query hook for API health check
 */

import { useQuery } from "@tanstack/react-query";
import { healthService } from "../../services/health.service";

const QUERY_KEYS = {
  health: ["health"] as const,
};

/**
 * Check API health status
 */
export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => healthService.check(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


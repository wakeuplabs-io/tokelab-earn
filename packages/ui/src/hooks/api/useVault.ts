/**
 * Vault Hooks
 * React Query hooks for vault operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vaultService } from "../../services/vault.service";
import { useAuth } from "../auth/useAuth";
import type { CreateVaultRequest } from "../../domain/entities/vault";

const QUERY_KEYS = {
  vault: ["vault"] as const,
};

/**
 * Get user's vault
 */
export function useVault() {
  const { getToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.vault,
    queryFn: async () => {
      if (!isAuthenticated) return null;
      const token = await getToken();
      const result = await vaultService.get(token);
      return result?.vault ?? null;
    },
    enabled: isAuthenticated,
    retry: false, // Don't retry on 404,
  });
}

/**
 * Create a new vault
 */
export function useCreateVault() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateVaultRequest) => {
      const token = await getToken();
      return vaultService.create(data, token);
    },
    onSuccess: () => {
      // Invalidate and refetch vault query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vault });
    },
  });
}

/**
 * Vault Service
 * API calls for vault operations using fetch
 */

import { apiGet, apiPost } from "../lib/api-client";
import type { CreateVaultRequest, Vault } from "../domain/entities/vault";

export interface CreateVaultResponse {
  vault: Vault;
}

export interface GetVaultResponse {
  vault: Vault;
}

export const vaultService = {
  /**
   * Create a new vault for the authenticated user
   */
  async create(
    data: CreateVaultRequest,
    token: string
  ): Promise<CreateVaultResponse> {
    return apiPost<CreateVaultResponse>("/api/vault", data, token);
  },

  /**
   * Get user's vault (if exists)
   * Note: This endpoint doesn't exist yet in the backend, but we can add it
   */
  async get(token: string): Promise<GetVaultResponse | null> {
    try {
      return await apiGet<GetVaultResponse>("/api/vault", token);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  },
};

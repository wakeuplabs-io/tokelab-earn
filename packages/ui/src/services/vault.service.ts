/**
 * Vault Service
 * Type-safe API calls for vault operations using Hono RPC client
 */

import { getApiClientWithToken } from "../lib/api-client";
import type { CreateVaultRequest, Vault } from "../domain/entities/vault";

export const vaultService = {
  /**
   * Create a new vault for the authenticated user
   */
  async create(data: CreateVaultRequest, getToken: () => Promise<string>): Promise<{ vault: Vault }> {
    const client = await getApiClientWithToken(getToken);
    const response = await client.api.vault.$post({
      json: data,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create vault");
    }

    return await response.json();
  },

  /**
   * Get user's vault (if exists)
   * Note: This endpoint doesn't exist yet in the backend, but we can add it
   */
  async get(getToken: () => Promise<string>): Promise<{ vault: Vault } | null> {
    const client = await getApiClientWithToken(getToken);
    const response = await client.api.vault.$get();

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get vault");
    }

    return await response.json();
  },
};


/**
 * Vault domain entity
 */

export type VaultStatus = "CREATING" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export interface Vault {
  id: string;
  fireblocksVaultId: string;
  name: string;
  status: VaultStatus;
  createdAt: string;
}

export interface CreateVaultRequest {
  name?: string;
  customerRefId?: string;
}


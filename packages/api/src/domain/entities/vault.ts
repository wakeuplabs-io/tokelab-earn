/**
 * Vault domain entity
 * Represents a 1:1 relationship between User and Fireblocks Vault Account
 * Each user has exactly one vault for complete segregation
 */

export type VaultStatus = "CREATING" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export interface Vault {
  id: string;
  userId: string;
  fireblocksVaultId: string;
  name: string;
  status: VaultStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVaultParams {
  userId: string;
  name?: string; // Optional, will be generated if not provided
  customerRefId?: string; // For idempotency tracking
}


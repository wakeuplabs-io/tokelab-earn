/**
 * Fireblocks SDK wrapper
 * Provides a clean interface for all Fireblocks operations
 * 
 * Architecture: This is infrastructure layer - never accessed directly from controllers
 * All Fireblocks interactions go through this adapter
 */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionStatus } from "fireblocks-sdk";
import { readFileSync } from "fs";
import { join } from "path";
import getEnv from "../../config/env";

export interface CreateVaultAccountParams {
  name: string;
  hiddenOnUI?: boolean;
  customerRefId?: string;
}

export interface CreateVaultAccountResult {
  id: string; // Fireblocks vault account ID
  name: string;
}

export interface CreateDepositAddressParams {
  vaultAccountId: string;
  assetId: string;
  description?: string;
}

export interface CreateDepositAddressResult {
  address: string;
  tag?: string; // For XRP/XLM
  legacyAddress?: string; // For some assets
  bip44AddressIndex?: number;
}

export interface CreateWithdrawalParams {
  vaultAccountId: string;
  assetId: string;
  amount: string; // Decimal string
  destination: {
    type: PeerType;
    oneTimeAddress?: {
      address: string;
      tag?: string;
    };
  };
  note?: string;
  customerRefId?: string;
}

export interface CreateWithdrawalResult {
  id: string; // Fireblocks transaction ID
  status: TransactionStatus;
}

export interface FireblocksTransaction {
  id: string;
  assetId: string;
  source?: {
    type: PeerType;
    id?: string;
  };
  destination?: {
    type: PeerType;
    id?: string;
    oneTimeAddress?: {
      address: string;
      tag?: string;
    };
  };
  amount: string;
  status: TransactionStatus;
  operation: TransactionOperation;
  createdAt: number;
  lastUpdated: number;
  note?: string;
  customerRefId?: string;
}

/**
 * Fireblocks client wrapper
 * Handles all Fireblocks API interactions
 */
export class FireblocksClient {
  private sdk: FireblocksSDK;

  constructor() {
    const env = getEnv();
    
    // Read private key from file
    const secretKeyPath = env.FIREBLOCKS_SECRET_KEY_PATH.startsWith("/")
      ? env.FIREBLOCKS_SECRET_KEY_PATH
      : join(process.cwd(), env.FIREBLOCKS_SECRET_KEY_PATH);

    const secretKey = readFileSync(secretKeyPath, "utf8");

    this.sdk = new FireblocksSDK(secretKey, env.FIREBLOCKS_API_KEY, env.FIREBLOCKS_BASE_URL);
  }

  /**
   * Create a new Vault Account for a user
   * This is the core segregation mechanism - one vault per user
   */
  async createVaultAccount(params: CreateVaultAccountParams): Promise<CreateVaultAccountResult> {
    try {
      const vaultAccount = await this.sdk.createVaultAccount(params.name, {
        hiddenOnUI: params.hiddenOnUI ?? false,
        customerRefId: params.customerRefId,
      });

      return {
        id: vaultAccount.id,
        name: vaultAccount.name || params.name,
      };
    } catch (error) {
      throw new FireblocksError(
        `Failed to create vault account: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Get vault account details
   */
  async getVaultAccount(vaultAccountId: string): Promise<any> {
    try {
      return await this.sdk.getVaultAccountById(vaultAccountId);
    } catch (error) {
      throw new FireblocksError(
        `Failed to get vault account ${vaultAccountId}: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Create a deposit address for a specific asset in a vault
   * Supports multiple addresses per asset (for privacy)
   */
  async createDepositAddress(
    params: CreateDepositAddressParams
  ): Promise<CreateDepositAddressResult> {
    try {
      const address = await this.sdk.generateNewAddress(
        params.vaultAccountId,
        params.assetId,
        params.description
      );

      return {
        address: address.address,
        tag: address.tag,
        legacyAddress: address.legacyAddress,
        bip44AddressIndex: address.bip44AddressIndex,
      };
    } catch (error) {
      throw new FireblocksError(
        `Failed to create deposit address for vault ${params.vaultAccountId}, asset ${params.assetId}: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Create a withdrawal transaction
   * Transaction Authorization Policy (TAP) is enforced by Fireblocks
   */
  async createWithdrawal(params: CreateWithdrawalParams): Promise<CreateWithdrawalResult> {
    try {
      const transaction = await this.sdk.createTransaction({
        assetId: params.assetId,
        source: {
          type: PeerType.VAULT_ACCOUNT,
          id: params.vaultAccountId,
        },
        destination: params.destination,
        amount: params.amount,
        operation: TransactionOperation.TRANSFER,
        note: params.note,
        customerRefId: params.customerRefId,
      });

      return {
        id: transaction.id,
        status: transaction.status,
      };
    } catch (error) {
      throw new FireblocksError(
        `Failed to create withdrawal: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Get transaction details by ID
   */
  async getTransaction(txId: string): Promise<FireblocksTransaction> {
    try {
      const tx = await this.sdk.getTransactionById(txId);
      
      return {
        id: tx.id,
        assetId: tx.assetId,
        source: tx.source,
        destination: tx.destination,
        amount: tx.amount,
        status: tx.status,
        operation: tx.operation,
        createdAt: tx.createdAt,
        lastUpdated: tx.lastUpdated,
        note: tx.note,
        customerRefId: tx.customerRefId,
      };
    } catch (error) {
      throw new FireblocksError(
        `Failed to get transaction ${txId}: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  /**
   * Get vault account balance for a specific asset
   */
  async getVaultBalance(vaultAccountId: string, assetId: string): Promise<string> {
    try {
      const account = await this.sdk.getVaultAccountById(vaultAccountId);
      const asset = account.assets?.find((a) => a.id === assetId);
      return asset?.total ?? "0";
    } catch (error) {
      throw new FireblocksError(
        `Failed to get balance for vault ${vaultAccountId}, asset ${assetId}: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }
}

/**
 * Custom error for Fireblocks operations
 */
export class FireblocksError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "FireblocksError";
  }
}

// Export singleton instance
let fireblocksClient: FireblocksClient;

export function getFireblocksClient(): FireblocksClient {
  if (!fireblocksClient) {
    fireblocksClient = new FireblocksClient();
  }
  return fireblocksClient;
}

export default getFireblocksClient();


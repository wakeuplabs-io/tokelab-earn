/**
 * Vault repository
 * Data access layer for Vault entities
 */

import { PrismaClient, VaultStatus } from "../../../generated/prisma/client";
import { Vault, CreateVaultParams } from "../../../domain/entities/vault";
import { getPrismaClient } from "../../../config/database";

export class VaultRepository {
  constructor(private readonly prisma: PrismaClient = getPrismaClient()) {}

  /**
   * Create a new vault
   */
  async create(params: CreateVaultParams & { fireblocksVaultId: string }): Promise<Vault> {
    const vault = await this.prisma.vault.create({
      data: {
        userId: params.userId,
        fireblocksVaultId: params.fireblocksVaultId,
        name: params.name,
        status: "CREATING",
      },
    });

    return this.toDomain(vault);
  }

  /**
   * Find vault by ID
   */
  async findById(id: string): Promise<Vault | null> {
    const vault = await this.prisma.vault.findUnique({
      where: { id },
    });

    return vault ? this.toDomain(vault) : null;
  }

  /**
   * Find vault by user ID (1:1 relationship)
   */
  async findByUserId(userId: string): Promise<Vault | null> {
    const vault = await this.prisma.vault.findUnique({
      where: { userId },
    });

    return vault ? this.toDomain(vault) : null;
  }

  /**
   * Find vault by Fireblocks vault ID
   */
  async findByFireblocksVaultId(fireblocksVaultId: string): Promise<Vault | null> {
    const vault = await this.prisma.vault.findUnique({
      where: { fireblocksVaultId },
    });

    return vault ? this.toDomain(vault) : null;
  }

  /**
   * Update vault status
   */
  async updateStatus(id: string, status: VaultStatus): Promise<Vault> {
    const vault = await this.prisma.vault.update({
      where: { id },
      data: { status },
    });

    return this.toDomain(vault);
  }

  /**
   * Update vault
   */
  async update(id: string, data: Partial<{ name: string; status: VaultStatus }>): Promise<Vault> {
    const vault = await this.prisma.vault.update({
      where: { id },
      data,
    });

    return this.toDomain(vault);
  }

  private toDomain(vault: any): Vault {
    return {
      id: vault.id,
      userId: vault.userId,
      fireblocksVaultId: vault.fireblocksVaultId,
      name: vault.name,
      status: vault.status as Vault["status"],
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
    };
  }
}

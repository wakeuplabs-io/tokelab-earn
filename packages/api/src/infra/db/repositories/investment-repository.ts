/**
 * Investment repository
 * Data access layer for Investment entities
 */

import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import {
  Investment,
  InvestmentWithRelations,
  ListInvestmentsFilters,
  UserInvestmentsFilters,
} from "../../../domain/entities/investment";
import { getPrismaClient } from "../../../config/database";

export class InvestmentRepository {
  constructor(private readonly prisma: PrismaClient = getPrismaClient()) {}

  /**
   * Find all investments with pagination and filters
   * Includes user, modelConfig, and yields relations
   */
  async findAllPaginated(
    skip: number,
    take: number,
    filters?: ListInvestmentsFilters,
  ): Promise<InvestmentWithRelations[]> {
    const where = this.buildWhereClause(filters);

    const investments = await this.prisma.investment.findMany({
      skip,
      take,
      where,
      include: {
        user: {
          select: { email: true },
        },
        modelConfig: {
          select: {
            type: true,
            durationDays: true,
            aprInitial: true,
            aprFinal: true,
            aprStepPct: true,
            aprStepPeriodDays: true,
            claimPeriodDays: true,
          },
        },
        yields: {
          select: {
            amount: true,
            status: true,
            monthlyYieldId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return investments.map((inv) => this.toDomainWithRelations(inv));
  }

  /**
   * Count total investments with filters
   */
  async count(filters?: ListInvestmentsFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.investment.count({ where });
  }

  /**
   * Find investment by ID
   */
  async findById(id: string): Promise<Investment | null> {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });

    return investment ? this.toDomain(investment) : null;
  }

  /**
   * Find investments by user ID
   */
  async findByUserId(userId: string): Promise<Investment[]> {
    const investments = await this.prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return investments.map((inv) => this.toDomain(inv));
  }

  /**
   * Find user's investments with pagination and filters
   * Includes modelConfig and yields relations (no user since it's the authenticated user)
   */
  async findByUserIdPaginated(
    userId: string,
    skip: number,
    take: number,
    filters?: UserInvestmentsFilters,
  ): Promise<InvestmentWithRelations[]> {
    const where = this.buildUserWhereClause(userId, filters);

    const investments = await this.prisma.investment.findMany({
      skip,
      take,
      where,
      include: {
        user: {
          select: { email: true },
        },
        modelConfig: {
          select: {
            type: true,
            durationDays: true,
            aprInitial: true,
            aprFinal: true,
            aprStepPct: true,
            aprStepPeriodDays: true,
            claimPeriodDays: true,
          },
        },
        yields: {
          select: {
            amount: true,
            status: true,
            monthlyYieldId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return investments.map((inv) => this.toDomainWithRelations(inv));
  }

  /**
   * Count user's investments with filters
   */
  async countByUserId(userId: string, filters?: UserInvestmentsFilters): Promise<number> {
    const where = this.buildUserWhereClause(userId, filters);
    return this.prisma.investment.count({ where });
  }

  /**
   * Build Prisma where clause for user's investments
   */
  private buildUserWhereClause(
    userId: string,
    filters?: UserInvestmentsFilters,
  ): Prisma.InvestmentWhereInput {
    const where: Prisma.InvestmentWhereInput = {
      userId, // Always filter by userId
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.modelType) {
      where.modelConfig = {
        type: filters.modelType,
      };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.startDate = {};
      if (filters.dateFrom) {
        where.startDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.startDate.lte = filters.dateTo;
      }
    }

    return where;
  }

  /**
   * Build Prisma where clause from filters
   */
  private buildWhereClause(filters?: ListInvestmentsFilters): Prisma.InvestmentWhereInput {
    const where: Prisma.InvestmentWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.modelType) {
      where.modelConfig = {
        type: filters.modelType,
      };
    }

    if (filters?.search) {
      where.user = {
        email: {
          contains: filters.search,
          mode: "insensitive",
        },
      };
    }

    // Date range filter on startDate
    if (filters?.dateFrom || filters?.dateTo) {
      where.startDate = {};
      if (filters.dateFrom) {
        where.startDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.startDate.lte = filters.dateTo;
      }
    }

    return where;
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(investment: any): Investment {
    return {
      id: investment.id,
      userId: investment.userId,
      modelConfigId: investment.modelConfigId,
      amount: investment.amount.toString(),
      currency: investment.currency,
      status: investment.status,
      startDate: investment.startDate,
      endDate: investment.endDate,
      accruedYield: investment.accruedYield.toString(),
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    };
  }

  /**
   * Map Prisma model with relations to domain entity
   */
  private toDomainWithRelations(investment: any): InvestmentWithRelations {
    return {
      ...this.toDomain(investment),
      user: {
        email: investment.user.email,
      },
      modelConfig: {
        type: investment.modelConfig.type,
        durationDays: investment.modelConfig.durationDays,
        aprInitial: investment.modelConfig.aprInitial?.toString() ?? null,
        aprFinal: investment.modelConfig.aprFinal?.toString() ?? null,
        aprStepPct: investment.modelConfig.aprStepPct?.toString() ?? null,
        aprStepPeriodDays: investment.modelConfig.aprStepPeriodDays,
        claimPeriodDays: investment.modelConfig.claimPeriodDays,
      },
      yields: investment.yields.map((y: any) => ({
        amount: y.amount.toString(),
        status: y.status,
        monthlyYieldId: y.monthlyYieldId,
      })),
    };
  }
}

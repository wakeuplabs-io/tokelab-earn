/**
 * MonthlyYield repository
 * Data access layer for MonthlyYield entities (VARIABLE model returns)
 */

import { PrismaClient } from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../config/database";

export interface MonthlyYieldData {
  id: string;
  month: string;
  actualReturnPct: string;
  status: string;
}

export class MonthlyYieldRepository {
  constructor(private readonly prisma: PrismaClient = getPrismaClient()) {}

  /**
   * Find monthly yield by month (YYYY-MM format)
   */
  async findByMonth(month: string): Promise<MonthlyYieldData | null> {
    const monthlyYield = await this.prisma.monthlyYield.findUnique({
      where: { month },
      select: {
        id: true,
        month: true,
        actualReturnPct: true,
        status: true,
      },
    });

    if (!monthlyYield) {
      return null;
    }

    return {
      id: monthlyYield.id,
      month: monthlyYield.month,
      actualReturnPct: monthlyYield.actualReturnPct.toString(),
      status: monthlyYield.status,
    };
  }
}

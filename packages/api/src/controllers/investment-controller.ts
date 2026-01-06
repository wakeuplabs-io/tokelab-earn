/**
 * Investment Controller
 * HTTP layer for investment operations
 */

import { Context } from "hono";
import { z } from "zod";
import { listInvestments } from "../usecases/list-investments";
import { InvestmentRepository } from "../infra/db/repositories/investment-repository";
import { MonthlyYieldRepository } from "../infra/db/repositories/monthly-yield-repository";

/**
 * Schema for list investments query parameters
 */
const listInvestmentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  modelType: z.enum(["FIXED", "VARIABLE"]).optional(),
  search: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

/**
 * GET /admin/investments
 * Lists all investments with pagination and filters (Admin endpoint)
 */
export async function listInvestmentsHandler(c: Context) {
  // Parse and validate query parameters
  const query = c.req.query();
  const validated = listInvestmentsSchema.parse({
    page: query.page,
    limit: query.limit,
    status: query.status,
    modelType: query.modelType,
    search: query.search,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });

  // Initialize dependencies
  const investmentRepository = new InvestmentRepository();
  const monthlyYieldRepository = new MonthlyYieldRepository();

  // Build filters
  const filters = {
    ...(validated.status && { status: validated.status }),
    ...(validated.modelType && { modelType: validated.modelType }),
    ...(validated.search && { search: validated.search }),
    ...(validated.dateFrom && { dateFrom: validated.dateFrom }),
    ...(validated.dateTo && { dateTo: validated.dateTo }),
  };

  // Execute use case
  const result = await listInvestments(
    {
      page: validated.page,
      limit: validated.limit,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
    {
      investmentRepository,
      monthlyYieldRepository,
    }
  );

  return c.json(result, 200);
}

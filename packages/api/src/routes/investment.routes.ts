/**
 * Investment Routes (User endpoints)
 * Routes for authenticated users to view their investments
 */

import { Hono } from "hono";
import {
  getUserInvestmentsHandler,
  getUserInvestmentsSummaryHandler,
} from "../controllers/investment-controller";
import { authMiddleware } from "../infra/auth/auth-middleware";

const router = new Hono();

// All routes require authentication
router.use("/*", authMiddleware);

// GET /api/investments - List user's investments
router.get("/", getUserInvestmentsHandler);

// GET /api/investments/summary - Get total available to claim
router.get("/summary", getUserInvestmentsSummaryHandler);

export default router;

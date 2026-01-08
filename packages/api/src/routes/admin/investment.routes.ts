/**
 * Admin Investment Routes
 * Routes for admin investment management
 */

import { Hono } from "hono";
import { listInvestmentsHandler } from "../../controllers/investment-controller";
import { authMiddleware } from "../../infra/auth/auth-middleware";
import { getEnv } from "../../config/env";

const router = new Hono();

// Auth middleware - skip in development/test for testing
const env = getEnv();
if (env.NODE_ENV !== "development" && env.NODE_ENV !== "test") {
  router.use("/*", authMiddleware);
}

// TODO: Add adminMiddleware when role-based access is implemented
// router.use("/*", adminMiddleware);

// GET /api/admin/investments - List all investments with pagination
router.get("/", listInvestmentsHandler);

export default router;

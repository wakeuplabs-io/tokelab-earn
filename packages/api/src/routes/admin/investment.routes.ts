/**
 * Admin Investment Routes
 * Routes for admin investment management
 */

import { Hono } from "hono";
import { listInvestmentsHandler } from "../../controllers/investment-controller";
import { authMiddleware } from "../../infra/auth/auth-middleware";

const router = new Hono();

// All routes require authentication
router.use("/*", authMiddleware);

// TODO: Add adminMiddleware when role-based access is implemented
// router.use("/*", adminMiddleware);

// GET /api/admin/investments - List all investments with pagination
router.get("/", listInvestmentsHandler);

export default router;

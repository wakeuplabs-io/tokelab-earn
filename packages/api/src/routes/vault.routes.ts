/**
 * Vault Routes
 */

import { Hono } from "hono";
import { createVaultHandler } from "../controllers/vault-controller";
import { authMiddleware } from "../infra/auth/auth-middleware";

const router = new Hono();

// All routes require authentication
router.use("/*", authMiddleware);

router.post("/", createVaultHandler);

export default router;

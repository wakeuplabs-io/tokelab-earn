/**
 * @fileoverview Main configuration for the Hono API application
 * Web3 Custody Platform API with Fireblocks integration
 * 
 * Architecture:
 * - Segregated vaults (one per user)
 * - Ledger-based accounting
 * - Fireblocks webhook handling
 *
 * @module app
 */

import createApp from "./lib/create-app";
import { getEnv } from "./config/env";
import { cors } from "hono/cors";

// Routes
import vaultRoutes from "./routes/vault.routes";
import webhookRoutes from "./routes/webhooks.routes";

/**
 * Main Hono application instance
 */
const app = createApp();

/**
 * CORS middleware configuration
 */
const env = getEnv();
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);

/**
 * API Routes
 * 
 * User endpoints (require authentication):
 * POST   /api/vault        - Create user vault
 * 
 * Webhooks (no auth, signature verified):
 * POST   /api/webhooks/fireblocks - Fireblocks webhook handler
 */
app.route("/api/vault", vaultRoutes);
app.route("/api/webhooks", webhookRoutes);

/**
 * Health check endpoint
 */
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;

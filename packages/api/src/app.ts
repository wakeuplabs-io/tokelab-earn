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
import { cors } from "hono/cors";

// Routes
import vaultRoutes from "./routes/vault.routes";
import investmentRoutes from "./routes/investment.routes";
import webhookRoutes from "./routes/webhooks.routes";
import adminInvestmentRoutes from "./routes/admin/investment.routes";

/**
 * Main Hono application instance
 */
const app = createApp();

/**
 * CORS middleware configuration
 */
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  }),
);

/**
 * API Routes
 *
 * User endpoints (require authentication):
 * POST   /api/vault              - Create user vault
 * GET    /api/investments        - List user's investments
 * GET    /api/investments/summary - Get total available to claim
 *
 * Admin endpoints (require authentication + admin role):
 * GET    /api/admin/investments - List all investments
 *
 * Webhooks (no auth, signature verified):
 * POST   /api/webhooks/fireblocks - Fireblocks webhook handler
 */
app.route("/api/vault", vaultRoutes);
app.route("/api/investments", investmentRoutes);
app.route("/api/admin/investments", adminInvestmentRoutes);
app.route("/api/webhooks", webhookRoutes);

/**
 * Health check endpoint
 */
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export type for Hono RPC client
export type AppType = typeof app;

export default app;

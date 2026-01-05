/**
 * @fileoverview Factory functions for creating Hono application instances
 * This file provides utilities for creating and configuring Hono applications
 * with middleware and error handling.
 *
 * @module lib/create-app
 */

import type { Schema } from "hono";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { notFound, serveEmojiFavicon } from "stoker/middlewares";
import { pinoLogger } from "../middlewares/pino-logger";
import { errorHandler } from "../middlewares/error-handler";

import type { AppBindings, AppType } from "./types";

/**
 * Creates a new Hono router instance with default configurations
 * @returns {AppType} A configured Hono router instance
 * @description
 * Creates a new router with:
 * - Custom AppBindings for type safety
 */
export function createRouter() {
  return new Hono<AppBindings>();
}

/**
 * Creates and configures the main application instance with all necessary middleware
 * @returns {AppType} A fully configured Hono application instance
 * @description
 * Sets up an application with:
 * - Request ID tracking
 * - Emoji favicon (📝)
 * - Pino logging middleware
 * - Custom 404 handler
 * - Global error handler
 */
export default function createApp() {
  const app = createRouter();
  app.use(requestId()).use(serveEmojiFavicon("📝")).use(pinoLogger());

  app.notFound(notFound);
  app.onError(errorHandler);
  return app;
}

/**
 * Creates a test application instance with a specific router
 * @template S - Schema type extending Hono's base Schema
 * @param {AppType<S>} router - The router to attach to the test application
 * @returns {AppType} A configured test application instance
 * @description
 * Useful for testing routes in isolation. Creates a minimal application
 * with the provided router mounted at the root path.
 */
export function createTestApp<S extends Schema>(router: AppType<S>) {
  return createApp().route("/", router);
}

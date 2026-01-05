/**
 * @fileoverview Index route configuration for the API
 * Defines the root endpoint that provides basic API information.
 *
 * @module routes/index
 */

import * as HttpStatusCodes from "stoker/http-status-codes";

import { createRouter } from "../lib/create-app";

/**
 * Index route configuration and handler
 * @description Creates a GET endpoint at the root path that returns API information
 */
const router = createRouter().get("/", (c) => {
  return c.json(
    {
      message: "hono-api-template",
    },
    HttpStatusCodes.OK,
  );
});

export default router;

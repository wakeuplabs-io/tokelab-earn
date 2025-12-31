/**
 * @fileoverview Example route handler implementation
 * Contains the business logic for the example endpoint.
 *
 * @module routes/example/handler
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import type { Context } from "hono";
import type { AppBindings } from "../../lib/types";

/**
 * Example endpoint handler
 * @description Handles GET requests to the /example endpoint
 *
 * @param {Context<AppBindings>} c - The Hono context object
 * @returns {Promise<Response>} JSON response with example message
 */
export const exampleHandler = async (c: Context<AppBindings>) => {
  return c.json(
    {
      message: "Api Hono Example route",
    },
    HttpStatusCodes.OK,
  );
};

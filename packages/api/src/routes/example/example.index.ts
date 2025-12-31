/**
 * @fileoverview Example route module entry point
 * Combines the route configuration and handler into a single router.
 *
 * @module routes/example
 */

import { createRouter } from "../../lib/create-app";
import * as handler from "./example.handler";

/**
 * Configured example router
 * @description Combines the example route definition with its handler
 * @type {import('../../lib/types').AppType}
 */
const router = createRouter().get("/example", handler.exampleHandler);

export default router;

/**
 * Webhook Routes
 */

import { Hono } from "hono";
import { handleFireblocksWebhook } from "../infra/webhooks/fireblocks-webhook-handler";

const router = new Hono();

router.post("/fireblocks", handleFireblocksWebhook);

export default router;


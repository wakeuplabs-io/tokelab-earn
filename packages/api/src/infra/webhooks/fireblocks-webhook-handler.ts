/**
 * Fireblocks Webhook Handler
 * Processes Fireblocks webhooks for transaction updates
 */

import { Context } from "hono";
import { verifyFireblocksWebhook, parseWebhookPayload } from "../fireblocks/webhook-verifier";

/**
 * Handle Fireblocks webhook
 * POST /webhooks/fireblocks
 */
export async function handleFireblocksWebhook(c: Context) {
  try {
    // Verify webhook signature
    const signature = c.req.header("X-Fireblocks-Signature");
    if (!signature) {
      return c.json({ error: "Missing signature" }, 401);
    }

    const rawBody = await c.req.text();

    if (!verifyFireblocksWebhook(rawBody, signature)) {
      return c.json({ error: "Invalid signature" }, 401);
    }

    // Parse webhook payload
    const payload = parseWebhookPayload(rawBody);

    // Route to appropriate handler based on webhook type
    switch (payload.type) {
      case "TRANSACTION_STATUS_CHANGED":
        // TODO: Handle transaction status changes
        console.log("Transaction status changed:", payload.data);
        break;

      case "VAULT_ACCOUNT_ADDED":
        // TODO: Handle new vault account
        console.log("Vault account added:", payload.data);
        break;

      default:
        console.log(`Unhandled webhook type: ${payload.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

/**
 * Fireblocks webhook signature verification
 * Ensures webhooks are authentic and from Fireblocks
 */

import { createHmac } from "crypto";
import getEnv from "../../config/env";

export interface FireblocksWebhookPayload {
  type: string;
  tenantId: string;
  timestamp: number;
  data: {
    id?: string;
    assetId?: string;
    source?: any;
    destination?: any;
    amount?: string;
    status?: string;
    operation?: string;
    [key: string]: any;
  };
}

/**
 * Verify Fireblocks webhook signature
 * @param payload - Raw request body as string
 * @param signature - X-Fireblocks-Signature header value
 * @returns true if signature is valid
 */
export function verifyFireblocksWebhook(payload: string, signature: string): boolean {
  const env = getEnv();
  const secret = env.FIREBLOCKS_WEBHOOK_SECRET;

  // Fireblocks uses HMAC-SHA256
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");

  // Use constant-time comparison to prevent timing attacks
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
}

/**
 * Constant-time string comparison
 * Prevents timing attacks
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

/**
 * Parse webhook payload
 */
export function parseWebhookPayload(payload: string): FireblocksWebhookPayload {
  try {
    return JSON.parse(payload) as FireblocksWebhookPayload;
  } catch (error) {
    throw new Error(
      `Invalid webhook payload: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

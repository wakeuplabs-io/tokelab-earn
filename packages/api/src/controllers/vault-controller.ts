/**
 * Vault Controller
 * HTTP layer for vault operations
 */

/**
 * Vault Controller
 * HTTP layer for vault operations
 */

import { Context } from "hono";
import { createVault } from "../usecases/create-vault";
import { VaultRepository } from "../infra/db/repositories/vault-repository";
//import { getFireblocksClient } from "../infra/fireblocks/fireblocks-client";
import { UnauthorizedError } from "../libs/errors";
import { z } from "zod";

const createVaultSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  customerRefId: z.string().optional(),
});

/**
 * POST /vault
 * Creates a new vault for the authenticated user
 */
export async function createVaultHandler(c: Context) {
  // Get user ID from auth context (set by auth middleware)
  const userId = c.get("userId") as string;

  if (!userId) {
    throw new UnauthorizedError("User ID not found in token");
  }

  const body = await c.req.json();
  const validated = createVaultSchema.parse(body);

  // Initialize dependencies
  const vaultRepository = new VaultRepository();
  //const fireblocksClient = getFireblocksClient();

  const result = await createVault(
    {
      userId,
      name: validated.name,
      customerRefId: validated.customerRefId,
    },
    {
      vaultRepository,
      // fireblocksClient,
    },
  );

  return c.json(
    {
      vault: {
        id: result.vault.id,
        fireblocksVaultId: result.vault.fireblocksVaultId,
        name: result.vault.name,
        status: result.vault.status,
        createdAt: result.vault.createdAt.toISOString(),
      },
    },
    201,
  );
}

/**
 * Idempotency helpers
 * Ensures operations can be safely retried
 */

import { PrismaClient } from "../generated/prisma/client";

export interface IdempotencyRecord {
  key: string;
  resourceType: string;
  resourceId: string;
  createdAt: Date;
}

/**
 * Check if an idempotency key has been used
 * Returns the existing resource ID if found
 */
export async function checkIdempotency(
  key: string,
  resourceType: string,
  prisma: PrismaClient 
): Promise<string | null> {
  // In a real implementation, you'd have an idempotency table
  // For now, we'll check in the specific resource tables
  
  // This is a simplified version - in production, use a dedicated idempotency table
  // with TTL for automatic cleanup
  
  switch (resourceType) {
    case "withdrawal":
      const withdrawal = await prisma.withdrawal.findUnique({
        where: { idempotencyKey: key },
        select: { id: true },
      });
      return withdrawal?.id ?? null;
    
    case "vault":
      // Check if vault was created with this key (stored in metadata)
      // This is a placeholder - implement based on your metadata structure
      return null;
    
    default:
      return null;
  }
}

/**
 * Store idempotency record
 * In production, use a dedicated table with TTL
 */
export async function storeIdempotency(
  key: string,
  resourceType: string,
  resourceId: string,
  prisma: PrismaClient
): Promise<void> {
  // In production, implement a proper idempotency table
  // For withdrawals, the idempotencyKey is already in the withdrawal table
  // This function is a placeholder for other resource types
}


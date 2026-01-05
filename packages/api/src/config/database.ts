/**
 * Prisma client configuration for serverless environments
 * Uses Neon serverless adapter for connection pooling
 */

import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

let prisma: PrismaClient;

/**
 * Get Prisma client instance (singleton)
 * Creates a new instance with Neon adapter for serverless compatibility
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    // Create Neon connection pool
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"],
    });
  }

  return prisma;
}

/**
 * Disconnect Prisma client (useful for cleanup in tests)
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null as unknown as PrismaClient;
  }
}

// Export singleton instance
export default getPrismaClient();


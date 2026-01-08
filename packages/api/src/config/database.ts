/**
 * Prisma client configuration
 * Uses Neon serverless adapter in production, standard client in development
 */

import { PrismaClient } from "../generated/prisma/client";

let prisma: PrismaClient;

/**
 * Get Prisma client instance (singleton)
 * In development: uses standard Prisma client for local PostgreSQL
 * In production: could use Neon adapter for serverless (configure as needed)
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    // Use standard Prisma client
    // For production with Neon serverless, uncomment the adapter code
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    // Production with Neon serverless (uncomment when deploying):
    // import { PrismaNeon } from "@prisma/adapter-neon";
    // const adapter = new PrismaNeon({ connectionString });
    // prisma = new PrismaClient({ adapter, log: ["error"] });
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

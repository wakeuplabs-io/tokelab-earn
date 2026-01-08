/**
 * Global test setup
 * Ensures DB connection is available and cleaned up after tests
 */

import { beforeAll, afterAll } from "vitest";
import { getPrismaClient, disconnectPrisma } from "../src/config/database";

beforeAll(async () => {
  // Verify DB connection
  const prisma = getPrismaClient();
  await prisma.$connect();

  // Verify we have seed data
  const investmentCount = await prisma.investment.count();
  if (investmentCount === 0) {
    console.warn("⚠️  No seed data found. Run `npm run db:seed` before running tests.");
  }
});

afterAll(async () => {
  await disconnectPrisma();
});

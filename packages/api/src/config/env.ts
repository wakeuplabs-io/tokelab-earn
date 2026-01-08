/**
 * Environment configuration with validation
 * Uses Zod for runtime type safety
 */

import { z } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";

expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
  })
);

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z
    .string()
    .transform((val) => Number(val))
    .default(3001),

  // Database (NeonDB)
  DATABASE_URL: z.string().url(), // Connection pool URL
  DIRECT_URL: z.string().url().optional(), // Direct connection for migrations

  // Fireblocks
  FIREBLOCKS_API_KEY: z.string().min(1),
  FIREBLOCKS_SECRET_KEY_PATH: z.string().min(1), // Path to private key file
  FIREBLOCKS_BASE_URL: z.string().url().optional(), // Defaults to production
  FIREBLOCKS_WEBHOOK_SECRET: z.string().min(1), // For webhook signature verification

  // Auth (Auth0)
  AUTH0_DOMAIN: z.string().min(1), // e.g., "your-tenant.auth0.com"
  AUTH0_AUDIENCE: z.string().optional(), // API identifier/audience

  // CORS
  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function getEnv(): Env {
  if (!env) {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.error("❌ Invalid environment variables:");
      console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
      console.error(
        "\n💡 Make sure you have a .env file in packages/api/ with all required variables.",
      );
      console.error("💡 Current working directory:", process.cwd());
      process.exit(1);
    }

    env = result.data;
  }
  return env;
}

// Export validated env
export default getEnv();

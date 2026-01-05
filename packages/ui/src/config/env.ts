/**
 * Environment configuration with validation
 * Uses Zod for runtime type safety
 */

import { z } from "zod";

const envSchema = z.object({
  // API
  VITE_API_URL: z.string().url().default("http://localhost:3001"),
  
  // Auth0
  VITE_AUTH0_DOMAIN: z.string().min(1),
  VITE_AUTH0_CLIENT_ID: z.string().min(1),
  VITE_AUTH0_AUDIENCE: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function getEnv(): Env {
  if (!env) {
    env = envSchema.parse(import.meta.env);
  }
  return env;
}

// Export validated env with friendly names
export const config = {
  get API_URL() {
    return getEnv().VITE_API_URL;
  },
  get AUTH0_DOMAIN() {
    return getEnv().VITE_AUTH0_DOMAIN;
  },
  get AUTH0_CLIENT_ID() {
    return getEnv().VITE_AUTH0_CLIENT_ID;
  },
  get AUTH0_AUDIENCE() {
    return getEnv().VITE_AUTH0_AUDIENCE;
  },
};

// Export default for backward compatibility
export default config;


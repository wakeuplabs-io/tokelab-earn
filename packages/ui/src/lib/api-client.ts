/**
 * Hono RPC Client
 * Type-safe API client for communicating with the backend
 */

import { hc } from "@hono/client";
import type { AppType } from "@api/app";
import { config } from "../config/env";

/**
 * Create Hono RPC client with type safety
 * Automatically includes types from the backend AppType
 * 
 * Note: Auth token is added via interceptor in services
 */
export const apiClient = hc<AppType>(config.API_URL, {
  init: {
    credentials: "include",
  },
});

/**
 * Get API client with Auth0 token
 * Use this helper to add the token to requests
 */
export async function getApiClientWithToken(getToken: () => Promise<string>) {
  const token = await getToken();
  
  return hc<AppType>(config.API_URL, {
    init: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    },
  });
}

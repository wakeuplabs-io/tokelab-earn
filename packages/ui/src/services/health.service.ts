/**
 * Health Service
 * API calls for health check endpoint
 */

import { apiGet } from "../lib/api-client";

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export const healthService = {
  /**
   * Check API health status
   * No authentication required
   */
  async check(): Promise<HealthResponse> {
    return apiGet<HealthResponse>("/health");
  },
};

/**
 * User Investment Service
 * API calls for user's own investment operations
 */

import { apiGet } from "../lib/api-client";
import type {
  GetUserInvestmentsParams,
  GetUserInvestmentsResponse,
  UserInvestmentSummary,
} from "../domain/entities/user-investment";

export const userInvestmentService = {
  /**
   * Get user's investments with pagination and filters
   */
  async list(params: GetUserInvestmentsParams, token: string): Promise<GetUserInvestmentsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.modelType) searchParams.set("modelType", params.modelType);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);

    const query = searchParams.toString();
    return apiGet<GetUserInvestmentsResponse>(
      `/api/investments${query ? `?${query}` : ""}`,
      token,
    );
  },

  /**
   * Get user's investment summary (total available to claim)
   */
  async getSummary(token: string): Promise<UserInvestmentSummary> {
    return apiGet<UserInvestmentSummary>("/api/investments/summary", token);
  },
};

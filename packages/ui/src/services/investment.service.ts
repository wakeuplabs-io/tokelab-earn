/**
 * Investment Service
 * API calls for investment operations
 */

import { apiGet } from "../lib/api-client";
import type { ListInvestmentsParams, ListInvestmentsResponse } from "../domain/entities/investment";

export const investmentService = {
  /**
   * List all investments with pagination and filters (Admin endpoint)
   */
  async list(params: ListInvestmentsParams, token: string): Promise<ListInvestmentsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.modelType) searchParams.set("modelType", params.modelType);
    if (params.search) searchParams.set("search", params.search);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);

    const query = searchParams.toString();
    return apiGet<ListInvestmentsResponse>(
      `/api/admin/investments${query ? `?${query}` : ""}`,
      token,
    );
  },
};

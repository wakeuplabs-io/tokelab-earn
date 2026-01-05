/**
 * API Client
 * Simple fetch-based client for communicating with the backend
 */

import { config } from "../config/env";

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Create API request with authentication
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const url = `${config.API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));

    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "GET",
    token,
  });
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    token,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
    token,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    token,
  });
}
